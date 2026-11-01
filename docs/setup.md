# Connecting production services

The free builder runs without external credentials. Authentication, activation and premium asset delivery are implemented but stay unavailable until the following setup is completed.

1. Create a Supabase project and apply `supabase/migrations/202611010001_collections.sql` through migrations or the SQL editor. No production migration has been executed by this implementation.
2. Copy `.env.example` to ignored `.env.local`. Set `APP_URL`, Supabase URL/publishable key/server secret, Gumroad product ID and a 32-byte random hexadecimal `LICENSE_ENCRYPTION_KEY`. Keep that encryption key stable and backed up: existing encrypted licenses require it. Never share keys in chat or commit them.
3. Configure Supabase Auth Site URL to APP_URL and allow the exact `/auth/callback` URL. Enable email sign-in and configure production SMTP. The default PKCE magic-link flow returns a code to this callback. Links must be opened in the browser that requested them.
4. Create a Gumroad product with license keys enabled. Insert its actual product ID and collection name in `public.collections`. Do not configure live checkout until the collection and pricing have been approved.
5. Upload paid SVG/PNG assets to the private `premium-assets` bucket and register each path and collection in `public.assets`. Current prototype assets remain intentionally public/free. Do not move files into the private bucket without updating the catalog.
6. Configure the same server environment in Vercel and deploy. This repository has not yet been deployed or attached to a Vercel project. No estimated hosting price is assumed.

## Implemented boundaries

Login requests and activation have persistent 15-minute attempt limits. Activation verifies email/product/status with Gumroad and atomically binds a sale to one account through a service-role-only SQL function. Purchased collections are readable through owner-scoped RLS. Encrypted licenses are not exposed to authenticated clients.

`GET /api/assets/:assetId` checks the session, entitlement and purchase before issuing a 60-second URL. Purchases older than 24 hours are verified again. Verification outages fail closed without deleting entitlements. Refunded/chargebacked purchases or unresolved disputes lose access. Public demo composition still uses public raster layers; premium selection will be wired when premium artwork exists.

## Validation

`npm test` covers purchase identity/product/status policy. `npm run test:e2e` checks all 54 free-builder combinations, transparent PNG export and mobile overflow against localhost:3000 using installed Microsoft Edge. `npm run build` checks production compilation and TypeScript. Real email delivery, concurrent SQL activation, refund synchronization and private Storage permissions must also be verified against a configured staging Supabase/Gumroad project before launch.

Editable production vector artwork is still a separate unfinished deliverable; SVG export remains disabled rather than wrapping raster artwork as editable paths.
