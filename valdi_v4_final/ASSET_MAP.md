# VALDI asset / pair audit

The supplied archive contains 53 JPG files, 48 unique images and 5 exact duplicate files. Product/model pairing is based on the same physical bag: body shape, handle construction, bead pattern, hardware and colour — not colour alone.

## Storefront pairs now considered confirmed

| Storefront card | Product asset | Model asset | Source-photo pair | Status |
|---|---|---|---|---|
| ARCH / PEARL | `product-pearl.webp` | `model-pearl.webp` | 1926 → 7228 | confirmed |
| ARCH / VIOLET | `product-lilac.webp` | `model-lilac.webp` | 6838 → 7229 | confirmed |
| ARCH / GREEN | `product-olive.webp` | `model-olive.webp` | 6837 → 7231 | confirmed |
| ARCH / YELLOW | `product-sun.webp` | `model-sun.webp` | 6836 → 7230 | confirmed |
| SCARF / PINK | `product-blush-silk.webp` | `model-rose.webp` | 6834 → 7174 | confirmed |
| SOFT / PINK WHITE | `product-knit.webp` | `model-knit-candy.webp` | 6883 → 7351 | confirmed |
| SOFT / CREAM | `product-knit-sand.webp` | `model-knit-sand.webp` | 6884 → 7352 | confirmed |
| SOFT / PINK | `product-knit-sorbet.webp` | `model-knit-sorbet.webp` | 6885 → 7353 | confirmed |

## Blue correction

The former `SCARF / BLUE` card incorrectly combined two different bags:

- `product-blue.webp` is a blue iridescent **arch** bag and is now shown as `ARCH / BLUE IRIDESCENT` with no hover image.
- `model-blue.webp` is the blue **scarf-handle** bag from source 7350 and is now shown as a separate `SCARF / BLUE` card with no fake secondary image.
- The true isolated source photo for the scarf-handle blue bag is source 6835. It is not currently stored in the repository under a dedicated storefront asset filename, so the storefront does not pretend that `product-blue.webp` is that bag.

## Product-only cards in the current storefront

- `product-rose.webp` / ARCH / ROSE: source product 7123. Its correct model photo is source 7227, but that exact model asset is not currently present under a safe storefront filename. Hover is intentionally disabled.
- `product-blue.webp` / ARCH / BLUE IRIDESCENT: separate from the blue scarf-handle bag. Hover is intentionally disabled.
- `model-blue.webp` / SCARF / BLUE: model-only storefront card until the correct isolated source 6835 is added as a dedicated asset.
- `product-gold.webp`: the previous `model-sun.webp` pairing was wrong. `model-sun.webp` belongs to the yellow arch bag, not GOLD.
- `product-smoke.webp` and `product-merlot.webp`: no model image is attached unless the same physical bag can be confirmed.
- All current `product-bridal-*.webp` cards remain product-only. Bridal campaign photos are editorial material, not automatic SKU pairs.

## Important correction

`model-rose.webp` is **not** the matching model image for `product-rose.webp`. It shows the pink scarf-handle bag and therefore belongs with `product-blush-silk.webp`.

## Full source-photo mapping used for the audit

- Flap variants: 7054, 7055, 7056, 7057, 7058, 7127 — product-only in the supplied archive.
- Arch: 7123 → 7227; 7124 → 7226; 7125 → 7237; 7126 product-only; 6836 → 7230; 6837 → 7231; 6838 → 7229; 1926 → 7228.
- Scarf handle: 6834 → 7174; 6835 → 7350. Beige scarf-handle appears only on-model (7176 / 7349).
- Crystal envelope: 1925 → 7232.
- Pearl chain: 1924 appears in bridal context 7292.
- Soft: 6883 → 7351; 6884 → 7352; 6885 → 7353.
- Bridal/custom mini format: 6839 with campaign context 7291 / 7295.
- Editorial-only: 7175 (magenta arch with no isolated product), 7176 / 7349 (beige scarf-handle with no isolated product), 6840 / 6841, 7291–7295, 7397 / 7398.

## Exact duplicates excluded from the source audit

- 7057 = 7404
- 7058 = 7403
- 7174 = 7174 (1)
- 7175 = 7175 (1)
- 7176 = 7176 (1)

The last four digits refer to the original Telegram-export filenames.
