# VALDI asset map — corrected product pairs

This map documents the card-level product/secondary-image relationships used by `assets/js/app.js`.

- ARCH / ROSE: `product-rose.webp` → `model-arch-rose.webp`
- ARCH / PEARL: `product-pearl.webp` → no secondary image; previous `model-pearl.webp` pairing was removed because it is a different bag
- ARCH / VIOLET: `product-lilac.webp` → `model-lilac.webp`
- ARCH / BLUE IRIDESCENT: `product-blue.webp` → `model-arch-blue-iridescent.webp`
- SCARF / BLUE: `product-scarf-blue.webp` → `model-blue.webp`; confirmed from source photos `...6835` → `...7350`
- ARCH / GREEN: `product-olive.webp` → `model-olive.webp`
- ARCH / YELLOW: `product-sun.webp` → `model-sun.webp`
- GOLD: `product-gold.webp` → `model-gold.webp`
- SCARF / PINK: `product-blush-silk.webp` → `model-rose.webp`
- SMOKE: `product-smoke.webp` → `model-smoke.webp`
- MERLOT: `product-merlot.webp` → `model-merlot.webp`
- SOFT / PINK WHITE: `product-knit.webp` → `model-knit-candy.webp`
- SOFT / CREAM: `product-knit-sand.webp` → `model-knit-sand.webp`
- SOFT / PINK: `product-knit-sorbet.webp` → `model-knit-sorbet.webp`
- BRIDAL / BLUSH: `product-bridal-blush.webp` → `model-bridal-blush.webp`
- BRIDAL / MIST: `product-bridal-mist.webp` → `model-bridal-mist.webp`
- BRIDAL / PEARL: `product-bridal-pearl.webp` → `model-bridal-pearl.webp`
- BRIDAL / SILVER: `product-bridal-silver.webp` → `model-bridal-silver.webp`
- BRIDAL / WHITE: `product-bridal-white.webp` → `model-bridal-white.webp`

Rule: do not reuse a visually similar bag as a secondary image for a different SKU. If a reliable pair is unavailable, keep the card product-only.
