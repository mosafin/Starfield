# Feature Report — UI Clickability QA + Compact Controls (Phase 22)
Date: 2026-06-06

## What Changed

Stabilised Phase 21 top UI layout: compact **More ▾** menu for save/export actions, sticky system details header, dynamic bottom spacing, and a developer-only `getUILayoutReport()` overlap audit.

## Why It Matters

Top-right save controls no longer wrap across half the screen or compete with the details panel. Every control should remain clickable after resize, and developers can quickly diagnose overlap issues in the console.

## Files Updated

- `Starmap - Fav v3 .html` — compact controls, layout sync, diagnostics, clickability CSS
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-static-check.js` — More menu + `getUILayoutReport` checks

## User-Facing Behaviour

### Compact top-right controls
- **Always visible:** − · zoom % · + · Reset view · **More ▾**
- **More menu:** Folder, Save, Export Universe, Export Atlas, Open save…, Refresh saves, Fresh Map
- Menu closes on outside click or Escape

### Details panel
- Starts below the full header (not under save controls)
- Sticky header keeps **×** close visible while scrolling
- Height respects bottom info panel via `--bottom-ui-reserve`

### Developer diagnostics (localhost / file / `?uiDev=1`)
- Run `getUILayoutReport()` in the browser console
- Prints element positions, z-index list, overlaps, and CSS layout variables

## Technical Notes

- `--bottom-ui-reserve` measured from `#infoPanel` when visible
- `#starmapViewport` explicit `z-index: 1`; chrome `120`, details `115`, layers `109`
- `UI_DEV_MODE` gates `window.getUILayoutReport` (not exposed in production CDN use without dev host)
- No save structure changes

## QA Summary

Static checks extended (29+). Manual browser click audit recommended at 1920×1080 and 768px.

## Known Issues

Folder save/load end-to-end still on deferred manual QA list.

## Next Phase Recommendation

Optional automated browser click test using `getUILayoutReport()` thresholds in CI on localhost.
