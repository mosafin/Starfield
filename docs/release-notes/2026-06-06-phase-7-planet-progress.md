# Feature Report — Phase 7 Planet Progress Tracking
Date: 2026-06-06

## What Changed

Planet bodies in the system details panel now support player progress: status (Not started / Visited / Surveyed / Completed / Skipped), notes, and per-system progress summaries. Progress persists under the existing `gameProgress.planets` save key.

## Why It Matters

Players can track survey and visit progress for planets and moons in the same save file as systems, missions, and locations — four independent progress layers in one JSON envelope.

## Files Updated

- `Starmap - Fav v3 .html` — planet state helpers, interactive planets section, merge on load
- `README.md` — planet tracking in player guide and save section
- `CONTEXT.md` — `planetStates` shape, functions, save rules
- `docs/known-issues.md` — updated planet limitations
- `memory/README.md` — project memory stub

## User-Facing Behaviour

Open **ℹ** on **Alpha Centauri**:

```
Planets: Completed 0 / 7
Visited/Surveyed/Completed planets: 0 / 7

Planets (7)
  Jemison
  Planet · Level 1 · Water, Iron · Locations: Completed 0 / 1
  [Status ▼] [Note field]
```

Systems with no catalogue planets show **Planets: 0**.

## Technical Notes

### Planet save shape (per edited id only)
```js
{
  status: 'not_started' | 'visited' | 'surveyed' | 'completed' | 'skipped',
  note: '',
  completedAt: ''
}
```

### New / updated functions
- `readPlanetState(id)` — display-only; never writes
- `savePlanetState(id, updates)` — sole writer to `planetStates`
- `getPlanetProgressSummaryForSystem(id)`
- `updateSystemDetailsPlanetProgress(id)`
- `mergePlanetStates(loaded)` — replaces `mergeAuxiliarySaveSections` for planets
- `formatPlanetCatalogMeta(planet)` — type, level, resources, linked location line

### Save rules
- Save envelope unchanged
- Opening details panel does **not** create planet save entries
- Fresh Map clears systems only — missions, planets, and locations preserved
- Planet edits do **not** call `renderStarmap()`

## QA Summary

**PASS** — 9/9 in final Phases 6–8 recheck (2026-06-06).

Verified: no save on panel open, status persists to localStorage, progress lines update, no map re-render, Jemison linked location meta, Vega Planets: 0, UI controls, Fresh Map preserves planet progress, import merge.

## Known Issues

- Planet catalogue covers subset of systems (44 entries)
- No planet badges on star map
- Folder save/load not in automated QA

## Next Phase Recommendation

1. Expand `planetData`
2. Optional planet badges on map
3. Dedicated reset for planet/location progress (if requested)
