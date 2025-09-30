# kingsmsg — region map fix (v2)

This package adds **complete coordinates** for Seoul (25 districts), Gyeonggi and Incheon,
and a robust `region-map.js` that decodes slugs and honors the coordinate map.

## Files
- `assets/region-coords.js` — all coordinates; merges into `window.__REGION_COORDS__`.
- `assets/region-map.js` — initializer that reads `/regions/{slug}.html` (with `decodeURIComponent`).

## How to use
1. Upload both files to `/assets/` (overwrite your existing `region-map.js`).
2. Ensure the order in every region page is:

```html
<script src="/assets/region-coords.js" defer></script>
<script src="/assets/region-map.js" defer></script>
```

> Order matters when using `defer`: files execute in HTML order.

## Notes
- If a page provides `<div id="region-map" data-lat="..." data-lng="...">`, those coordinates win.
- If a slug has URL-encoded Korean (e.g. `gyeonggi-%EA%B3%A0%EC%96%91`), `region-map.js` decodes it to `gyeonggi-고양` before lookup.
- Default fallbacks: Seoul / Gyeonggi / Incheon centers.
- Check the browser console for `[region-map] slug: ... coords: ...` to verify.
