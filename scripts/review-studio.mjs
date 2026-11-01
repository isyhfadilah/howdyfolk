import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import sharp from 'sharp';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const code=ts.transpileModule(await fs.readFile('src/features/builder/StudioCharacter.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText;
const module={exports:{}};
new Function('require','module','exports',code)(require,module,module.exports);
const Character=module.exports.default;
const embedded={};
for(const name of ['head-a','head-b','head-c','head-a-alternate','head-b-alternate','head-c-alternate','outfit-shirt','outfit-cardigan','outfit-blazer']) embedded[name]='data:image/png;base64,'+(await fs.readFile('public/illustrations/studio/'+name+'.png')).toString('base64');
await fs.mkdir('.artwork-review',{recursive:true});
for(let accessory=0;accessory<3;accessory++){
 const cards=[];
 for(let person=0;person<3;person++)for(let hair=0;hair<2;hair++)for(let outfit=0;outfit<3;outfit++){
  const svg=renderToStaticMarkup(React.createElement(Character,{person,hair,outfit,accessory,embedded})).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ');
  const buffer=await sharp(Buffer.from(svg)).png().toBuffer();
  cards.push(await sharp(buffer).resize(256,256).toBuffer());
  if(outfit===0) await sharp(buffer).flatten({background:'#faf7f0'}).png().toFile(`.artwork-review/${person}-${hair}-${accessory}.png`);
 }
 await sharp({create:{width:1536,height:768,channels:4,background:'#faf7f0'}}).composite(cards.map((input,i)=>({input,left:(i%6)*256,top:Math.floor(i/6)*256}))).png().toFile(`.artwork-review/contact-${accessory}.png`);
}
console.log('Rendered all 54 combinations using the actual studio renderer.');