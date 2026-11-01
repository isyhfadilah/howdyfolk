import 'server-only';
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import {z} from 'zod';
const purchase=z.object({sale_id:z.string().min(1),product_id:z.string().min(1),email:z.email(),refunded:z.boolean(),disputed:z.boolean(),dispute_won:z.boolean(),chargebacked:z.boolean()});
export async function verifyLicense(license:string,product:string){
 const response=await fetch('https://api.gumroad.com/v2/licenses/verify',{method:'POST',body:new URLSearchParams({license_key:license,product_id:product,increment_uses_count:'false'}),cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(response.status===404)return null;
 if(!response.ok)throw new Error('Verification unavailable');
 const result=await response.json();
 if(!result.success)return null;
 return purchase.parse(result.purchase);
}
function encryptionKey(){const key=process.env.LICENSE_ENCRYPTION_KEY;if(!key||!/^([a-f0-9]{64})$/i.test(key))throw new Error('License encryption is not configured');return Buffer.from(key,'hex');}
export function encryptLicense(value:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey(),iv);const encrypted=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv,cipher.getAuthTag(),encrypted].map(x=>x.toString('base64')).join('.');}
export function decryptLicense(value:string){const [iv,tag,data]=value.split('.').map(x=>Buffer.from(x,'base64'));const decipher=createDecipheriv('aes-256-gcm',encryptionKey(),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(data),decipher.final()]).toString('utf8');}
