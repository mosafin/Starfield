# Feature Report — Planet Drilldown View (Phase 13)
Date: 2026-06-06

## What Changed

Replaced the flat Planets + Locations sections in the system details panel with a collapsible **System → Planet → Location → Mission** hierarchy. Added in-panel search, progress indicators, lazy expansion, and **Show on Map** actions.

## Why It Matters

Players can browse an entire system like an offline atlas — expand Jemison to see New Atlantis, The Lodge, and linked missions — without leaving the details panel or changing the starmap layout.

## Files Updated

- `Starmap - Fav v3 .html` — drilldown UI, CSS, lazy render, local search
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- **▼ Planets (N)** — collapsible section with local search: *Search planets and locations…*
- Click a **planet** → locations list, status/note controls, Show on Map
- Click a **location** → linked missions with status icons, status/note controls, Show on Map
- Progress icons: **✓** completed · **⚠** in progress/visited/active · **○** not started
- **Orbital & system** group for POIs with no `planetId`
- Galaxy search bar unchanged — panel search filters only the open system

## Technical Notes

- `renderSystemDetailsDrilldown()` renders only the selected system (lazy bodies on expand)
- State: `systemDetailsDrilldownState` (expanded ids, section collapse, search query) — not saved
- `missionById` index added in `buildCatalogueIndexes()`
- Save envelope unchanged; progress still via `savePlanetState()` / `saveLocationState()` only

## QA Summary

Static review: hierarchy renders from catalogue indexes; validation unchanged; save keys unchanged.

## Known Issues

- Full panel refresh (e.g. explored toggle) rebuilds drilldown DOM but preserves expand state in memory
- Mobile drilldown layout not fully QA'd

## Next Phase Recommendation

Optional: scroll-to-node when jumping from Missions tab; remember expand state per system in session only (still not saved)
