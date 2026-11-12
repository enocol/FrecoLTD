# Product images

Drop real product photos in this folder. Anything in `public/` is served from the
site root, so a file saved here as `images/eng-001.jpg` is referenced in the
catalogue as `/images/eng-001.jpg`.

## One image

1. Save the photo here, named after the product id, e.g. `eng-001.jpg`.
2. In [`../../src/data/products.json`](../../src/data/products.json) add an
   `"image"` field to that product:

   ```json
   {
     "id": "eng-001",
     "name": "2.0L TDI Diesel Engine (Complete)",
     "image": "/images/eng-001.jpg",
     "...": "other fields"
   }
   ```

## Multiple images (a gallery)

When a product has several photos, name them `-1`, `-2`, … and use an `"images"`
**array** instead. The first entry is the main image; the rest appear as clickable
thumbnails on the product page.

```json
{
  "id": "whl-001",
  "name": "18\" Alloy Wheel Set (4) — Graphite",
  "images": [
    "/images/whl-001-1.jpg",
    "/images/whl-001-2.jpg",
    "/images/whl-001-3.jpg"
  ],
  "...": "other fields"
}
```

Use **either** `image` (one photo) **or** `images` (many) — if both are present,
`images` wins.

Products with **no** image field keep the auto-generated placeholder, and if any
path is wrong/missing the site falls back to the placeholder automatically — so a
typo never shows a broken image.

## Tips

- Use `.jpg` for photos, `.webp` for smaller files, `.png` only if transparency is
  needed.
- Resize to ~1000px on the long edge and keep each file under ~300 KB.
- A roughly 4:3 landscape crop matches the card/detail frames best.
