# Feature Report — Zoom Viewport & Reset View
Date: 2026-06-06

## What Changed
Fixed zoom-out breaking the map view. Added a fixed full-screen **viewport** layer, corrected zoom math, pan clamping, **Reset** zoom button, and document-level drag release.

## Why It Matters
Zooming out previously shrank the interactive map and exposed a mismatched background, making the tool hard to use mid-session. Players can now zoom out safely, zoom back in, and recover with one click.

## Files Updated
- `Starmap - Fav v3 .html` — `#starmapViewport`, pan/zoom refactor, `#resetZoomBtn`
- `README.md` — controls and keyboard shortcuts
- `CONTEXT.md` — DOM structure and pan/zoom sections

## User-Facing Behaviour
- Background stays consistent dark space (`#0d1117`) at all zoom levels.
- Pan and wheel zoom work on the full screen, not just the shrunken map tile.
- **Reset** (top-right, next to zoom) returns to 100% zoom and centered pan.
- Keyboard **0** also resets view.

## Technical Notes
- **`#starmapViewport`**: fixed 100vw×100vh, `#0d1117`, receives pointer events
- **`.starmap-container`**: inner layer receives `transform: translate(panX, panY) scale(scale)`
- **`zoomAt`**: uses viewport bounding rect, not scaled container rect
- **`clampPan()`**: centers when `scale < 1`; clamps edges when zoomed in
- **`resetZoom()`**: `scale=1`, `panX=panY=0`
- **`document.addEventListener('mouseup', endPan)`** — fixes stuck drag (QA item)
- Body `bg-gray-900` removed; body + viewport share `#0d1117`

## QA Summary
**Pass** — min zoom 25%, max 500%, background consistent, reset restores 100%, 120 points remain at min zoom.

## Known Issues
At zoom ≤ 100%, `clampPan()` auto-centers the map (no free pan while zoomed out). See `docs/known-issues.md`.

## Next Phase Recommendation
Optional “pan to system” when using Show on Map from Missions view; consider renaming zoom **Reset** to **Reset view** to distinguish from Reset Exploration.
