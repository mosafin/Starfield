# Feature Report — Phase 8 Map Layers & Categories
Date: 2026-06-06

## What Changed

Added a collapsible **Map layers** panel on the Star Systems tab. Players can toggle display-only layers to highlight matching systems and fade others — without removing markers or changing saved progress.

## Why It Matters

While exploring or chasing active missions, players can quickly see which systems have cities, stations, active quests, notes, or exploration/scan status — combined with the existing search bar and mission badges.

## Files Updated

- `Starmap - Fav v3 .html` — layers panel UI, `mapLayerState`, class-based map updates, details panel location type summary
- `README.md` — map layers guide and controls table
- `CONTEXT.md` — layer state, functions, CSS classes, save rules
- `docs/known-issues.md` — location layer note

## Available Map Layers

| Group | Layer |
|-------|-------|
| Missions | Mission systems |
| Missions | Systems with active missions |
| Missions | Completed mission systems |
| Locations | Cities · Settlements · Starstations · Staryards · Temples · Outposts · Vendors |
| Notes | Systems with notes |
| Progress | Explored · Unexplored · Scanned · Unscanned |

**Quick actions:** Show active missions · Clear all layers

## User-Facing Behaviour

- Panel sits top-left near **Search systems…** (mobile: above bottom controls)
- Matching systems: purple `.layer-match` glow
- Non-matching (when any layer on): faded via `.layer-faded`
- Location layers add compact indicators under labels (e.g. `🏙 City  🛰 Station`)
- System details **ℹ** panel shows `Cities: X · Stations: X · Temples: X · Outposts: X` when catalogue data exists

## Technical Notes

- `mapLayerState` and panel expand state are **runtime only** — not in `getSavePayload()`
- `systemLocationIndex` built once from `locationData` — no duplicate catalogue
- `applyMapPointVisualState()` unifies search + layer classes; no full `renderStarmap()` on toggle
- Layer logic uses OR across enabled toggles; combines with search (both can fade/highlight)

## QA Checklist (Phase 8)

- [x] Existing saves load
- [x] Search still works with layers active
- [x] Mission badges unchanged by layers
- [x] Dashboard / progress counters unchanged (120 systems render)
- [x] Details panel location type summary
- [x] Layer toggles update instantly (class-only; 120 markers retained)
- [x] Show active missions shortcut
- [x] No layer keys in save JSON
- [x] No markers disappear when layers enabled

**Automated browser smoke:** 11/11 in final Phases 6–8 recheck (2026-06-06). Full suite: 42/42 effective pass including cross-phase regressions.
