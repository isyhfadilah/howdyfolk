type Props = {person:number; hair:number; outfit:number; accessory:number; embedded?:Record<string,string>};

// Landmarks are measured in the original 1280px artwork, not shared canvas coordinates.
export const characterFits = [
  [{x:190,y:60,size:650,eyes:[[672,480],[838,514]],ear:[492,545]}, {x:190,y:60,size:650,eyes:[[672,480],[838,514]],ear:[492,545]}],
  [{x:238,y:100,size:520,eyes:[[615,548],[802,528]],ear:[421,630]}, {x:238,y:100,size:520,eyes:[[615,548],[802,528]],ear:[421,630]}],
  [{x:248,y:110,size:540,eyes:[[663,462],[840,507]],ear:[447,579]}, {x:248,y:89,size:540,eyes:[[662,513],[838,564]],ear:[446,628]}],
];
const outfits=['shirt','cardigan','blazer'];
export default function StudioCharacter({person,hair,outfit,accessory,embedded}:Props){
  const fit=characterFits[person][hair];
  const path=(name:string)=>embedded?.[name]??`/illustrations/studio/${name}.png`;
  const [[lx,ly],[rx,ry]]=fit.eyes;
  const angle=Math.atan2(ry-ly,rx-lx)*180/Math.PI;
  const head=`head-${'abc'[person]}${hair?'-alternate':''}`;
  // Put the necklace on the garment, never across the neck join or under a collar.
  const necklaceY=[650,635,625][outfit];
  const necklaceCenter=person===1?515:510;
  const neckCut=[1040,1090,1070][person];
  const clipId=`head-neck-${person}-${hair}`;
  const bodyWidth=[820,940,880][person];
  const bodyX=(1024-bodyWidth)/2;
  const necklace=<g transform={`translate(${necklaceCenter} ${outfit===0?595:necklaceY})`} fill="none" stroke="#242321" strokeWidth="2.5" strokeLinecap="round"><path d="M-62 -72 Q-55 12 0 38 Q55 12 62 -72"/><circle cy="43" r="6" fill="#fffdf9"/></g>;
  return <svg id="modular-character" viewBox="0 0 1024 1024" role="img" aria-label={`Character ${'ABC'[person]} with ${outfits[outfit]}`}>
    <defs><clipPath id={clipId}><rect width="1024" height={fit.y+neckCut*fit.size/1280}/></clipPath></defs>
    <path d="M435 455 H575 L598 665 Q512 730 420 665Z" fill="#fffdf9"/>
    <image href={path(head)} x={fit.x} y={fit.y} width={fit.size} height={fit.size} clipPath={`url(#${clipId})`}/>
    {person===1&&outfit===0&&<path d="M420 545 Q510 595 604 545 L630 730 H395Z" fill="white" stroke="#242321" strokeWidth="2"/>}
    {accessory===2&&outfit===0&&necklace}
    <image href={path(`outfit-${outfits[outfit]}`)} x={bodyX} y="225" width={bodyWidth} height="820" preserveAspectRatio="none"/>
    {accessory===1&&<g transform={`translate(${fit.x} ${fit.y}) scale(${fit.size/1280})`} fill="none" stroke="#242321" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={lx} cy={ly} rx="87" ry="52" transform={`rotate(${angle} ${lx} ${ly})`}/>
      <ellipse cx={rx} cy={ry} rx="67" ry="46" transform={`rotate(${angle} ${rx} ${ry})`}/>
      <path d={`M${lx+85} ${ly+9} Q${(lx+rx)/2+10} ${(ly+ry)/2-24} ${rx-65} ${ry-7}`}/>
      <path d={`M${lx-84} ${ly-14} Q${fit.ear[0]+30} ${fit.ear[1]-35} ${fit.ear[0]} ${fit.ear[1]}`}/>
    </g>}
    {accessory===2&&outfit!==0&&necklace}
  </svg>;
}
