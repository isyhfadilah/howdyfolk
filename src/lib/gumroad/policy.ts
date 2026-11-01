export type Purchase={sale_id:string;product_id:string;email:string;refunded?:boolean;disputed?:boolean;dispute_won?:boolean;chargebacked?:boolean};
export function purchaseActive(p:Purchase){return !p.refunded&&!p.chargebacked&&(!p.disputed||Boolean(p.dispute_won));}
export function purchaseMatches(p:Purchase,email:string,product:string){return p.product_id===product&&p.email.trim().toLowerCase()===email.trim().toLowerCase()&&purchaseActive(p);}
