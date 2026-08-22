# VALDI asset map — corrected product pairs

This map documents the card-level image relationships used by `assets/js/app.js`.

## Active storefront image mapping

- ARCH / ROSE: `product-rose.webp` → no secondary image; the confirmed model shot is currently disabled because its stored WebP is over-compressed.
- ARCH / PEARL: `product-pearl.webp` → no secondary image; previous `model-pearl.webp` pairing was removed because it is a different bag.
- ARCH / VIOLET: `product-lilac.webp` → `model-lilac.webp`.
- ARCH / BLUE IRIDESCENT: `product-blue.webp` → no secondary image; the confirmed model shot is currently disabled because its stored WebP is over-compressed.
- SCARF / BLUE: `model-blue.webp` is used as the active high-quality storefront image. The confirmed isolated source is `...6835` and model source is `...7350`; the isolated `product-scarf-blue.webp` stored in the repository is currently disabled because it is over-compressed.
- ARCH / GREEN: `product-olive.webp` → `model-olive.webp`.
- ARCH / YELLOW: `product-sun.webp` → `model-sun.webp`.
- GOLD: `product-gold.webp` → no secondary image while the stored model asset is over-compressed.
- SCARF / PINK: `product-blush-silk.webp` → `model-rose.webp`.
- SMOKE: `product-smoke.webp` → no secondary image while the stored model asset is over-compressed.
- MERLOT: `product-merlot.webp` → no secondary image while the stored model asset is over-compressed.
- SOFT / PINK WHITE: `product-knit.webp` → `model-knit-candy.webp`.
- SOFT / CREAM: `product-knit-sand.webp` → `model-knit-sand.webp`.
- SOFT / PINK: `product-knit-sorbet.webp` → `model-knit-sorbet.webp`.
- BRIDAL / BLUSH: `product-bridal-blush.webp` → no secondary image while the stored secondary asset is over-compressed.
- BRIDAL / MIST: `product-bridal-mist.webp` → no secondary image while the stored secondary asset is over-compressed.
- BRIDAL / PEARL: `product-bridal-pearl.webp` → no secondary image while the stored secondary asset is over-compressed.
- BRIDAL / SILVER: `product-bridal-silver.webp` → no secondary image while the stored secondary asset is over-compressed.
- BRIDAL / WHITE: `product-bridal-white.webp` → no secondary image while the stored secondary asset is over-compressed.

## Quality rule

Do not serve an over-compressed placeholder merely to preserve a hover state. Use the verified high-quality product/model image that belongs to the same physical bag, or keep the card product-only until a proper HQ asset is stored.

## Pairing rule

Do not reuse a visually similar bag as a secondary image for a different SKU. Product/model matching is based on the same physical bag: silhouette, handle construction, bead pattern, hardware and colour — not colour alone.
