import {describe,it,expect} from 'vitest';
import {purchaseActive,purchaseMatches,type Purchase} from './policy';
const base:Purchase={sale_id:'sale',product_id:'collection',email:'buyer@example.com'};
describe('purchase access policy',()=>{
 it('matches the purchase email case-insensitively and the exact product',()=>{expect(purchaseMatches(base,' BUYER@example.com ','collection')).toBe(true);expect(purchaseMatches(base,'someone@example.com','collection')).toBe(false);expect(purchaseMatches(base,base.email,'other-product')).toBe(false);});
 it.each(['refunded','chargebacked','disputed'] as const)('denies %s purchases',flag=>expect(purchaseActive({...base,[flag]:true})).toBe(false));
 it('allows a resolved dispute but never a refund',()=>{expect(purchaseActive({...base,disputed:true,dispute_won:true})).toBe(true);expect(purchaseActive({...base,refunded:true,dispute_won:true})).toBe(false);});
});
