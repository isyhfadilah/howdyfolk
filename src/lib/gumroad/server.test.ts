import {afterEach,describe,it,expect,vi} from 'vitest';
vi.mock('server-only',()=>({}));
import {encryptLicense,decryptLicense,verifyLicense} from './server';
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
describe('license security',()=>{
 it('encrypts with a unique nonce and detects tampering',()=>{
  vi.stubEnv('LICENSE_ENCRYPTION_KEY','ab'.repeat(32));
  const first=encryptLicense('test-license'),second=encryptLicense('test-license');
  expect(first).not.toBe(second);expect(first).not.toContain('test-license');expect(decryptLicense(first)).toBe('test-license');
  vi.stubEnv('LICENSE_ENCRYPTION_KEY','cd'.repeat(32));expect(()=>decryptLicense(first)).toThrow();
 });
 it('fails closed with an invalid encryption configuration',()=>{vi.stubEnv('LICENSE_ENCRYPTION_KEY','');expect(()=>encryptLicense('test')).toThrow();});
 it('does not increment Gumroad uses and does not cache verification',async()=>{
  const request=vi.fn().mockResolvedValue({ok:true,status:200,json:async()=>({success:true,purchase:{sale_id:'sale',product_id:'product',email:'buyer@example.com',refunded:false,disputed:false,dispute_won:false,chargebacked:false}})});vi.stubGlobal('fetch',request);
  expect((await verifyLicense('key','product'))?.sale_id).toBe('sale');
  const options=request.mock.calls[0][1];expect(options.cache).toBe('no-store');expect(options.body.get('increment_uses_count')).toBe('false');
 });
 it('distinguishes unavailable verification from an invalid license',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:503}));await expect(verifyLicense('key','product')).rejects.toThrow();
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:404}));await expect(verifyLicense('key','product')).resolves.toBeNull();
 });
});
