# Feature Report — UI Layout Collision Fix + Faction Overlay Polish (Phase 21)
Date: 2026-06-06

## What Changed

Reorganized the top of the screen into three non-overlapping zones (tabs/universe · search · zoom/save), added dynamic spacing so panels sit below the header, and polished the faction territory overlay with summary counts and quick-filter buttons.

## Why It Matters

The view tabs, universe selector, search bar, and save controls were stacking on top of each other and blocking clicks on the map layers panel. The app is usable again at the top of the screen, and faction overlays are faster to toggle.

## Files Updated

- `Starmap - Fav v3 .html` — top UI chrome grid, CSS variables, layout sync, faction quick filters
- `README.md` — layout and faction controls
- `CONTEXT.md` — UI layout functions and CSS variables
- `docs/known-issues.md` — resolved overlap issue
- `memory/README.md` — latest release note pointer
- `scripts/qa-static-check.js` — pan-ignore check for `top-ui-chrome`

## User-Facing Behaviour

### Top layout (Part A)
- **Top-left:** view tabs + Current Universe selector
- **Top-centre:** system search (Star Systems view only)
- **Top-right:** zoom + save controls
- Map layers, resource filter, and system details start **below** the header (auto-sized)
- On narrow screens, the three zones stack vertically at the top

### Faction polish (Part B)
- **Faction Summary** rows show `United Colonies: 42 systems` style counts (all six factions)
- **Quick filters:** Show UC · Show Freestar · Show Crimson Fleet · Show Unknown · Clear faction overlay
- System details order: Faction → Influence → Mission count → Difficulty tier

## Technical Notes

- CSS variables: `--ui-gap`, `--top-bar-height`, `--left-panel-top`, `--right-panel-top`, `--secondary-panel-top`, `--top-chrome-height`
- `#topUiChrome` fixed header; `syncTopUiLayout()` + `ResizeObserver` set panel top offsets
- `clearFactionOverlay()` clears faction layer checkboxes without affecting save data
- No save structure changes; layer/UI layout state not persisted

## QA Summary

Static checks pass (27/27). Manual browser verification recommended for click targets at 1920×1080 and 768px width.

## Known Issues

Pan/zoom and folder save/load still on deferred manual QA list (`docs/known-issues.md`).

## Next Phase Recommendation

Optional `disputed` border-system overlay when catalogue metadata is extended.
