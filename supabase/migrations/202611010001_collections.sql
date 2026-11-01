create table public.collections(id uuid primary key default gen_random_uuid(), name text not null, gumroad_product_id text unique not null);
create table public.purchases(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, sale_id text unique not null, collection_id uuid not null references public.collections(id), encrypted_license text not null, active boolean not null default true, verified_at timestamptz not null default now());
create table public.entitlements(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, collection_id uuid not null references public.collections(id), purchase_id uuid unique not null references public.purchases(id) on delete cascade, active boolean not null default true, unique(user_id,collection_id));
create table public.assets(id uuid primary key default gen_random_uuid(), collection_id uuid not null references public.collections(id), storage_path text unique not null);
create table public.rate_limits(key text primary key, started_at timestamptz not null, attempts integer not null);
alter table public.collections enable row level security;
alter table public.purchases enable row level security;
alter table public.entitlements enable row level security;
alter table public.assets enable row level security;
alter table public.rate_limits enable row level security;
create policy collections_read on public.collections for select to anon,authenticated using(true);
create policy entitlements_read on public.entitlements for select to authenticated using(user_id=auth.uid());
revoke all on public.purchases,public.rate_limits,public.assets from anon,authenticated;
revoke all on public.entitlements from anon,authenticated;
grant select on public.entitlements,public.collections to authenticated;
grant select on public.collections to anon;

create function public.consume_rate_limit(p_key text,p_limit integer) returns boolean language plpgsql security definer set search_path=public as $$
declare v_attempts integer;
begin
 insert into rate_limits(key,started_at,attempts) values(p_key,now(),1)
 on conflict(key) do update set attempts=case when rate_limits.started_at<now()-interval '15 minutes' then 1 else rate_limits.attempts+1 end,
 started_at=case when rate_limits.started_at<now()-interval '15 minutes' then now() else rate_limits.started_at end
 returning attempts into v_attempts;
 return v_attempts<=p_limit;
end;$$;
revoke all on function public.consume_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer) to service_role;

create function public.activate_purchase(p_user uuid,p_sale text,p_product text,p_license text) returns void language plpgsql security definer set search_path=public as $$
declare v_collection uuid; v_purchase purchases;
begin
 select id into strict v_collection from collections where gumroad_product_id=p_product;
 insert into purchases(user_id,sale_id,collection_id,encrypted_license) values(p_user,p_sale,v_collection,p_license) on conflict(sale_id) do nothing;
 select * into strict v_purchase from purchases where sale_id=p_sale for update;
 if v_purchase.user_id<>p_user or v_purchase.collection_id<>v_collection then raise exception 'Purchase already assigned'; end if;
 update purchases set encrypted_license=p_license,active=true,verified_at=now() where id=v_purchase.id;
 insert into entitlements(user_id,collection_id,purchase_id,active) values(p_user,v_collection,v_purchase.id,true)
 on conflict(user_id,collection_id) do update set active=true,purchase_id=excluded.purchase_id;
end;$$;
revoke all on function public.activate_purchase(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.activate_purchase(uuid,text,text,text) to service_role;

insert into storage.buckets(id,name,public) values('premium-assets','premium-assets',false) on conflict(id) do nothing;
-- No public Storage policies: delivery uses the server after entitlement verification.
