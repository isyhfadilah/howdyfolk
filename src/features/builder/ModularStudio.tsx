'use client';

import {useState} from 'react';
import StudioCharacter from './StudioCharacter';

const people = ['A', 'B', 'C'];
const outfits = ['shirt', 'cardigan', 'blazer'];
const outfitNames = ['Easygoing shirt', 'Everyday cardigan', 'The good blazer'];

export default function ModularStudio() {
  const [person, setPerson] = useState(0);
  const [outfit, setOutfit] = useState(0);
  const [hair, setHair] = useState(0);
  const [accessory, setAccessory] = useState(0);
  const [tab, setTab] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const clothing = `/illustrations/studio/outfit-${outfits[outfit]}.png`;
  async function download() {
    setBusy(true); setMessage('');
    try {
      const clone = document.getElementById('modular-character')!.cloneNode(true) as SVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      await Promise.all(Array.from(clone.querySelectorAll('image')).map(async image => {
        const response = await fetch(image.getAttribute('href')!);
        if (!response.ok) throw new Error('Asset unavailable');
        const data = await response.blob();
        const url = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(data); });
        image.setAttribute('href', url);
      }));
      const source = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], {type:'image/svg+xml'}));
      try {
        const image = new Image(); image.src = source; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 2048;
        const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
        context.drawImage(image, 0, 0, 2048, 2048);
        const blob = await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Export failed')),'image/png'));
        const url = URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download=`howdyfolk-${people[person]}-${outfits[outfit]}.png`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
        setMessage('Your character is ready. Say hello!');
      } finally {URL.revokeObjectURL(source);}
    } catch {setMessage('Your download couldn’t be created. Please try again.');}
    finally {setBusy(false);}
  }

  return <>
    <header><a className="logo" href="/">howdyfolk <span>☺</span></a><nav><a href="#studio">Character studio</a><a href="#about">About the folk</a><span className="pill">THE NEW FOLK · ARTWORK PREVIEW</span></nav></header>
    <main><section className="intro"><div className="eyebrow">GOOD PEOPLE. ENDLESS LITTLE POSSIBILITIES.</div><h1>Same folk.<br/><em>A whole new look.</em><span className="spark">✳</span></h1><p>Meet your new cast of characters. Find their outfit,<br/>switch up their hair, and add a little personality.</p><div className="intro-bottom"><span>↓ MAKE SOMEONE YOU’D LIKE TO MEET</span><span className="scribble">Three faces. Your kind of people.</span></div></section>
    <section id="studio" className="studio"><aside><div className="panel-heading"><h2>Meet your folk</h2><span>START WITH A FACE</span></div><div className="people-picker">{people.map((name,i)=><button className={person===i?'person active':'person'} key={name} aria-pressed={person===i} onClick={()=>setPerson(i)}><img src={`/illustrations/studio/head-${name.toLowerCase()}.png`} alt={`Character ${name}`}/><b>Character {name}</b></button>)}</div>
    <div className="tabs">{['Outfit','Hair','Accessories'].map((name,i)=><button key={name} className={tab===i?'selected':''} onClick={()=>setTab(i)}>{name}</button>)}</div>
    <div className="option-heading"><b>{['Dress the part','A fresh silhouette','The finishing touch'][tab]}</b><span>{tab===1?'2 styles':'3 choices'}</span></div>
    <div className="modular-options">{tab===0?outfits.map((name,i)=><button key={name} className={outfit===i?'active':''} aria-pressed={outfit===i} onClick={()=>setOutfit(i)}><img src={`/illustrations/studio/outfit-${name}.png`} alt=""/><span>{outfitNames[i]}</span></button>):tab===1?['Signature hair','A different day'].map((name,i)=><button key={name} className={hair===i?'active':''} aria-pressed={hair===i} onClick={()=>setHair(i)}><img src={`/illustrations/studio/head-${people[person].toLowerCase()}${i?'-alternate':''}.png`} alt=""/><span>{name}</span></button>):['Keep it simple','Reading glasses','A little necklace'].map((name,i)=><button key={name} className={accessory===i?'active accessory-option':'accessory-option'} aria-pressed={accessory===i} onClick={()=>setAccessory(i)}><strong>{['—','⌕','♧'][i]}</strong><span>{name}</span></button>)}</div>
    <p className="artwork-note">Original AI-assisted artwork, assembled in layers. Hair variants are tailored to each face. Expressions and poses are coming after this artwork review.</p>
    <button className="reset" onClick={()=>{setPerson(0);setOutfit(0);setHair(0);setAccessory(0);setMessage('')}}>↶ Start fresh</button></aside>
    <div className="preview modular-preview"><div className="preview-top"><span><i/> LIVE ARTWORK</span><span>Character {people[person]} · {outfitNames[outfit]}</span></div>
    <StudioCharacter person={person} hair={hair} outfit={outfit} accessory={accessory}/>
    <button className="random" onClick={()=>{setPerson(Math.floor(Math.random()*3));setOutfit(Math.floor(Math.random()*3));setHair(Math.floor(Math.random()*2));setAccessory(Math.floor(Math.random()*3))}}>⚄ &nbsp; Surprise me</button><div className="preview-footer"><span>A LITTLE PERSONALITY, LAYER BY LAYER</span><span>✧ Howdyfolk studio</span></div></div></section>
    <section className="download"><div><b>Good company, ready to go.</b><p>Transparent PNG · 2048 × 2048 · Artwork preview</p></div><div><button disabled title="Editable vector artwork is not ready yet">SVG · in development</button><button className="dark" disabled={busy} onClick={download}>{busy?'Preparing…':'Download PNG ↓'}</button></div></section><p role="status">{message}</p>
    <section id="about" className="benefits"><div><span>✳</span><b>Three distinct personalities</b><p>The faces you chose, with their own signature looks.</p></div><div><span>↗</span><b>Clothes that mix and match</b><p>One wardrobe. Every character is invited.</p></div><div><span>♡</span><b>Quality before quantity</b><p>Refining the artwork before growing the collection.</p></div></section><footer><a className="logo" href="/">howdyfolk ☺</a><span>Little characters. Lots of personality.</span><span>ARTWORK DEVELOPMENT · 2026</span></footer></main>
  </>;
}
