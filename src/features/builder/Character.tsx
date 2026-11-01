type Props = { choices: number[]; ink: string; shirt: string };

/** All body variants have exactly two arms; the waving silhouette replaces the relaxed one. */
export default function Character({ choices, ink, shirt }: Props) {
  const waving = choices[3] === 1;
  return (
    <svg id="character" viewBox="0 0 500 500" fill="white" stroke={ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={waving ? 'Character waving with one hand' : 'Character with both arms relaxed'}>
      <defs>
        <clipPath id="torso-clip"><path d="M205 298 Q250 316 295 298 Q326 302 335 330 L344 445 H156 L165 330 Q174 302 205 298Z"/></clipPath>
      </defs>
      {/* Arms sit behind the torso. Never retain a relaxed arm on the waving side. */}
      <g data-part="left-arm">
        <path fill={shirt} d="M178 310 Q151 309 145 340 L133 403 L162 410 L181 348Z"/>
        <path d="M136 404 L131 433 Q130 443 138 445 H153 Q160 443 159 435 L161 410Z"/>
        <path fill="none" d="M141 432 L140 442 M148 433 L147 443"/>
      </g>
      <g data-part="right-arm">
        {waving ? <>
          {/* Continuous forearm and open hand: thumb plus four rounded fingers. */}
          <path d="M345 349 Q364 345 375 312 L392 264 Q405 252 408 237 L419 211 Q422 204 417 202 Q412 200 408 207 L400 221 L404 183 Q405 175 399 175 Q393 175 392 182 L389 212 L387 169 Q387 161 381 162 Q376 162 376 170 L376 211 L369 175 Q367 168 362 170 Q357 172 359 180 L365 218 L355 198 Q351 191 346 194 Q342 197 346 204 L361 240 Q365 251 370 258 L350 306 L331 318Z"/>
          <path fill="none" d="M371 237 Q381 228 394 235 M371 247 Q379 243 387 246"/>
          <path fill={shirt} d="M321 310 Q339 305 351 319 L361 333 Q354 353 339 360 L318 346Z"/>
        </> : <>
          <path fill={shirt} d="M322 310 Q349 309 355 340 L367 403 L338 410 L319 348Z"/>
          <path d="M364 404 L369 433 Q370 443 362 445 H347 Q340 443 341 435 L339 410Z"/>
          <path fill="none" d="M359 432 L360 442 M352 433 L353 443"/>
        </>}
      </g>
      <path fill={shirt} d="M205 298 Q250 316 295 298 Q326 302 335 330 L344 445 H156 L165 330 Q174 302 205 298Z"/>
      {choices[2] === 1 && <g clipPath="url(#torso-clip)" fill="none"><path d="M150 353 H350 M150 378 H350 M150 403 H350 M150 428 H350"/></g>}
      <path d="M225 269 V299 Q250 323 275 299 V269Z"/>
      {choices[2] === 0 ? <g fill="none"><path d="M224 298 L234 328 L250 314 L266 328 L276 298 M250 315 V443"/><circle cx="261" cy="350" r="2" fill={ink}/><circle cx="261" cy="377" r="2" fill={ink}/><circle cx="261" cy="404" r="2" fill={ink}/></g> : <path fill="none" d="M220 302 Q250 339 280 302"/>}
      <path d="M194 188 Q177 180 177 200 Q177 219 195 220 M306 188 Q323 180 323 200 Q323 219 305 220"/>
      {/* Mirrored face contour and aligned landmarks keep the base geometry balanced. */}
      <path d="M194 160 Q194 115 250 113 Q306 115 306 160 V216 Q306 275 250 284 Q194 275 194 216Z"/>
      {choices[0] === 0 ? <path fill={ink} d="M194 177 Q178 145 190 119 Q200 94 224 98 Q247 78 272 98 Q303 94 314 123 Q323 149 306 177 L299 146 Q270 151 240 127 Q222 148 201 148Z"/> : choices[0] === 1 ? <path fill={ink} d="M194 177 Q173 170 179 149 Q163 131 182 119 Q178 96 202 96 Q213 76 235 87 Q250 68 268 87 Q291 76 303 96 Q327 96 322 119 Q341 132 324 150 Q330 170 306 177 L299 144 Q274 155 250 139 Q226 155 201 144Z"/> : <g fill="none"><path d="M194 176 Q183 138 199 116 Q214 94 250 94 Q286 94 301 116 Q317 138 306 176"/><path d="M202 140 Q224 120 250 124 Q276 120 298 140"/></g>}
      <g fill="none"><path d="M215 179 Q224 175 233 179 M267 179 Q276 175 285 179"/><path d="M250 196 L245 218 Q250 222 255 218"/></g>
      <ellipse cx="224" cy="196" rx="2.5" ry="4" fill={ink} stroke="none"/><ellipse cx="276" cy="196" rx="2.5" ry="4" fill={ink} stroke="none"/>
      {choices[1] === 0 ? <path fill="none" d="M232 238 Q250 254 268 238"/> : choices[1] === 1 ? <path fill={ink} d="M232 236 Q250 244 268 236 Q264 257 250 257 Q236 257 232 236Z"/> : <ellipse cx="250" cy="243" rx="8" ry="10"/>}
    </svg>
  );
}
