# Approved visual direction and production record

The user approved all three A/B/C characters from the initial editorial black-and-white comparison. The previous code-authored cartoon geometry is superseded.

Assets in `public/illustrations/studio` are AI-generated transparent PNG layers. They are raster, not editable vectors. The studio therefore offers PNG export only and explicitly disables editable SVG export.

Built-in image generation was used with the approved comparison as reference. Head prompt set: preserve the left tied-haired woman (A), middle curly-haired man (B), and right bob-haired woman (C); output only head/hair/neck, black editorial ink and white skin, transparent square canvas, no clothes or text. Target head area x310–714/y70–465, neck ending y570 on a nominal 1024 canvas. Actual generated assets require calibrated placement because generation does not guarantee requested coordinates.

Outfit prompt set: create an open-collar shirt, cardigan over crew-neck tee, and blazer over crew-neck tee; separate transparent torso-only layers, no head/hair/skin/accessories, matching fine editorial black ink, opaque white fabric, relaxed sleeves and no visible hands. Target collar x512/y520, shoulders x210–814/y570 and waist y990.

Hair edit prompt set: preserve exact identity, facial landmarks, neck, framing and transparent background; change A to short wavy pixie, B to softly swept side part, C to high bun. Hair changes are identity-specific complete head variants, not independent vector hair pieces.

Current preview uses layered raster artwork with lightweight vector accessory overlays. Full vectorization, expression variants, pose variants and independently replaceable hair components remain further production work. Run `node scripts/review-studio.mjs` to review the eighteen core combinations once all assets are present.
