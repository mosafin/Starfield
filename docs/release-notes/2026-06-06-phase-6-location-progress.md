# Feature Report — Phase 6 Location Progress Tracking
Date: 2026-06-06

## What Changed

Location POIs in the system details panel now support player progress: status (Not started / Visited / Completed / Skipped), notes, and per-system progress summaries. Progress persists under the existing `gameProgress.locations` save key.

## Why It Matters

Players can track which cities, stations, and settlements they have visited or completed without a separate checklist — using the same JSON save file as missions and map exploration.

## Files Updated

- `Starmap - Fav v3 .html` — location state helpers, interactive details panel, merge on load
- `README.md` — location tracking in player guide and save section
- `CONTEXT.md` — `locationStates` shape, functions, save rules
- `docs/known-issues.md` — updated location limitations
- `memory/README.md` — project memory stub

## User-Facing Behaviour

Open **ℹ** on a system with catalogue locations (e.g. **Alpha Centauri**):

```
Locations: Completed 0 / 1
Visited/Completed locations: 0 / 1

Locations (1)
  Cities
    New Atlantis
    City · Jemison · 3 linked missions
    [Status ▼] [Note field]
```

Systems with no catalogue entries show **Locations: 0** and “No locations catalogued yet.”

## Technical Notes

### Location save shape (per edited id only)
```js
{
  status: 'not_started' | 'visited' | 'completed' | 'skipped',
  note: '',
  completedAt: ''  // ISO when status becomes completed
}
```

### New / updated functions
- `readLocationState(id)` — display-only; never writes
- `saveLocationState(id, updates)` — sole writer to `locationStates`
- `getLocationProgressSummaryForSystem(id)` / `getLocationProgressSummaryForPlanet(planetId)`
- `updateSystemDetailsLocationProgress(id)` — in-panel progress lines
- `mergeLocationStates(loaded)` — key-by-key merge on import

### Save rules
- Save envelope unchanged: `{ systems, missions, planets, locations }`
- Opening details panel does **not** create location save entries
- Fresh Map clears systems only — missions and locations preserved
- Location edits do **not** call `renderStarmap()`

## QA Summary

**PASS** — 9/9 in final Phases 6–8 recheck (2026-06-06).

Verified: no save on panel open, status/note persist to localStorage, progress lines update in place, no map re-render on edit, completedAt on completed, Vega shows Locations: 0, normalizeSaveData for locations key, UI controls work, Fresh Map preserves location progress.

## Known Issues

- Starter catalogue still 10 entries
- No location badges on star map
- Folder save/load not in automated QA

## Next Phase Recommendation

1. Expand `locationData`
2. Optional location badges on map (without full re-render churn)
3. Wire `gameProgress.planets` when planet visit tracking is scoped
