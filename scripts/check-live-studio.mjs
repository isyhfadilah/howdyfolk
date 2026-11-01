import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:2});
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await fs.mkdir('.artwork-review/live',{recursive:true});
 for(let person=0;person<3;person++){
  await page.locator('.people-picker button').nth(person).click();
  await page.getByRole('button',{name:'Accessories',exact:true}).click();
  await page.getByRole('button',{name:/Reading glasses/}).click();
  await page.locator('#modular-character image').evaluateAll(async images=>Promise.all(images.map(async image=>{const loaded=new Image();loaded.src=image.getAttribute('href');await loaded.decode();})));
  await page.locator('.studio').screenshot({path:`.artwork-review/live/${'abc'[person]}.png`});
  console.log(JSON.stringify({person:'ABC'[person],layers:await page.locator('#modular-character image').evaluateAll(images=>images.map(image=>({src:image.getAttribute('href'),x:image.getAttribute('x'),y:image.getAttribute('y'),width:image.getAttribute('width')})))}));
 }
 let combinations=0;
 for(let person=0;person<3;person++)for(let hair=0;hair<2;hair++)for(let outfit=0;outfit<3;outfit++)for(let accessory=0;accessory<3;accessory++){
  await page.locator('.people-picker button').nth(person).click();
  for(const [tab,choice] of [['Hair',hair],['Outfit',outfit],['Accessories',accessory]]){
   await page.getByRole('button',{name:tab,exact:true}).click();
   await page.locator('.modular-options button').nth(choice).click();
  }
  const layers=await page.locator('#modular-character image').evaluateAll(async images=>Promise.all(images.map(async image=>{const loaded=new Image();loaded.src=image.getAttribute('href');await loaded.decode();return {src:image.getAttribute('href'),width:Number(image.getAttribute('width'))};})));
  if(!layers[0].src.includes(`head-${'abc'[person]}${hair?'-alternate':''}.png`))throw new Error('Wrong head variant');
  if(layers[0].width!==[650,520,540][person]||layers[1].width!==[820,940,880][person])throw new Error('Character fit not applied');
  combinations++;
 }
 const downloading=page.waitForEvent('download');
 await page.getByRole('button',{name:'Download PNG',exact:false}).click();
 const download=await downloading;
 await download.saveAs('.artwork-review/live/download.png');
 const {default:sharp}=await import('sharp');
 const metadata=await sharp('.artwork-review/live/download.png').metadata();
 if(metadata.width!==2048||metadata.height!==2048||!metadata.hasAlpha)throw new Error('Invalid PNG export');
 await page.setViewportSize({width:390,height:844});
 await page.locator('.studio').screenshot({path:'.artwork-review/live/mobile.png'});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw new Error('Mobile horizontal overflow');
 if(process.env.CHECK_UNCONFIGURED_SERVICES==='1'){
  await page.goto('http://localhost:3000/login');
  if(await page.locator('h1').evaluate(element=>getComputedStyle(element).fontSize)!=='36px')throw new Error('Tailwind typography is not active');
  if(!await page.getByRole('button',{name:'Email me a sign-in link'}).isDisabled())throw new Error('Unconfigured authentication should be disabled');
  await page.goto('http://localhost:3000/account');
  if(!page.url().endsWith('/login'))throw new Error('Account should require authentication');
  const denied=await page.request.get('http://localhost:3000/api/assets/00000000-0000-0000-0000-000000000000');
  if(denied.status()!==503)throw new Error('Unconfigured premium delivery should fail closed');
  console.log('Unconfigured account and premium access correctly denied.');
 }
 console.log(`Checked ${combinations} live combinations, PNG export and mobile overflow.`);
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('Live page loaded all character layers without browser errors.');
} finally {await browser.close();}
