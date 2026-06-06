# Feature Report — Catalogue, Drilldown, Survey & Resource Atlas (Phases 12–15)
Date: 2026-06-06

## What Changed

This release cycle expanded the offline atlas from starter catalogues through galaxy-wide resource lookup:

| Phase | Summary |
|-------|---------|
| **12 — Catalogue Pack 2** | +82 planets, +13 locations for 12 systems + Neon/Akila POIs (149 / 37 total) |
| **13 — Planet drilldown** | System → Planet → Location → Mission hierarchy in ℹ panel; lazy expand; in-panel search |
| **14 — Survey tracker** | Optional per-planet survey counters; **Planets Surveyed** line; Survey + Resources map layers |
| **15 — Galaxy Resource Atlas** | Resource indexes; **Galaxy Progress** + **Resources** tabs; live resource search; map highlight |
| **15 QA fix** | **Reset filter** bar on Star Systems; highlight decoupled from atlas search typing |

## Why It Matters

Players can browse expanded system catalogues, track survey progress, find resources galaxy-wide (e.g. “Where is Water?”), jump to systems from results, and clear resource highlights without losing save data — all offline in one HTML file.

## Files Updated

- `Starmap - Fav v3 .html` — catalogues, drilldown UI, survey state, resource indexes, views, filter bar
- `README.md` — four-tab switcher, drilldown, survey, resource atlas, reset filter controls
- `CONTEXT.md` — indexes, resource atlas functions, highlight lifecycle
- `memory/README.md` — project memory stub
- `docs/known-issues.md` — Phase 12–15 limitations and resolved items
- `docs/release-notes/` — per-phase reports + this summary

## User-Facing Behaviour

### Catalogue (Phase 12)
- Wolf, Tau Ceti, Jaffa, and 9 other Pack 2 systems show expanded planet lists
- New POIs: The Den (Wolf), Neon districts, Akila landmarks, Jaffa quest sites, orbital POIs

### Drilldown (Phase 13)
- **▼ Planets** tree with progress icons and **Show on Map**
- Search filters only the open system (galaxy search unchanged)

### Survey (Phase 14)
- Expand a planet → edit flora/fauna/resources/traits found/total
- **Overall Survey %** and **✓ Survey Complete** badge
- Map layers: **Has survey progress**, **Survey complete**, catalogue **Resources** toggles

### Resource atlas (Phase 15)
- **Resources** tab — search Iron, Aluminum, Copper, Helium-3, Titanium, Nickel, Water
- Stats + **Found on** tree; **Highlight on Map** / **Show on Map**
- Drilldown resource links open atlas pre-filtered (no map highlight until map buttons)
- **Galaxy Progress** tab — read-only systems / missions / planet / location summary
- After map highlight: **Resource filter** bar + **Reset filter** on Star Systems view

## Technical Notes

### Save envelope (unchanged)
```js
{ systems, missions, planets, locations }
```
- `survey` nested under `planets[id]` when player edits survey fields only
- Resource indexes and atlas highlight are **runtime-only** — not saved

### New runtime indexes (`buildCatalogueIndexes()`)
- `resourcesByPlanet`, `planetsByResource`, `systemsByResource`
- Existing: `planetById`, `missionById`, `planetsBySystemId`, etc.

### Resource highlight rules (post QA fix)
- `setResourceAtlasHighlight()` — only from **Highlight on Map** / **Show on Map**
- `renderResourceAtlasPanel()` — renders cards only; does not set map highlight
- `openResourceAtlas()` — opens Resources tab; does not set map highlight
- `clearResourceAtlasHighlight()` — **Reset filter**; sticky across tab switches

### Key functions added/changed
`renderSystemDetailsDrilldown`, `savePlanetSurvey`, `mergePlanetStates` (survey merge), `getMatchingAtlasResources`, `renderResourceAtlasPanel`, `renderGalaxyProgressPanel`, `setResourceAtlasHighlight`, `clearResourceAtlasHighlight`, `updateResourceFilterBar`

## QA Summary

**PASS** — Static re-check after filter fix (2026-06-06).

| Area | Result |
|------|--------|
| Phase 12 catalogue integrity | PASS — 149 planets, 37 locations, 0 orphan refs |
| Phase 13 drilldown | PASS |
| Phase 14 survey + layers | PASS |
| Phase 15 resource atlas | PASS |
| Reset filter flow | PASS (was FAIL; fixed) |
| Save shape / no new keys | PASS |
| Mission tracking | PASS — unchanged |

**Prior bugs resolved:** reset filter re-applying on tab switch; multi-match search auto-highlight; atlas typing auto-highlighting map.

**Not live-tested this cycle:** folder save/load, pan/zoom smoke, mobile layout at 768px.

## Known Issues

See `docs/known-issues.md`:
- Nickel — 0 catalogue hits until data added
- Titanium/Nickel searchable in atlas but no map-layer toggles yet
- Resource atlas uses catalogue `planetData.resources`, not player survey counts
- Mobile drilldown + resource filter bar stacking — manual check recommended

## Next Phase Recommendation

1. **Catalogue Pack 3** — mid-traffic systems still without bodies
2. **Resource categories UI** — surface `RESOURCE_CATEGORIES` stub in atlas
3. **Nickel / Titanium map layers** — when catalogue coverage grows
4. **Manual folder save smoke** — close recurring QA gap
