# Feature Report — Phase 5 Location / POI Data Foundation
Date: 2026-06-06

## What Changed

Added a read-only location catalogue and a **Locations** section in the system details panel. POIs are grouped by type with planet names and linked mission counts where defined. No location progress is saved yet.

## Why It Matters

Players can browse key cities, stations, and settlements under each system without leaving the map — groundwork for future visit/complete tracking under the existing `locations` save key.

## Files Updated

- `Starmap - Fav v3 .html` — `locationData`, helpers, details panel rendering
- `README.md` — locations section in player guide
- `CONTEXT.md` — `locationData` shape and function table
- `docs/known-issues.md` — location catalogue limitations
- `memory/README.md` — project memory stub

## User-Facing Behaviour

Open **ℹ** on a system with catalogue data (e.g. Alpha Centauri, Sol, Kryx):

```
Locations (1)
  Cities
    New Atlantis
    Jemison · 3 linked missions
```

Systems without catalogue entries show: **No locations catalogued yet.**

## Technical Notes

### Starter catalogue (10 entries)
| Location | Type | System | Planet |
|----------|------|--------|--------|
| New Atlantis | city | Alpha Centauri | Jemison |
| Cydonia | city | Sol | Mars |
| Akila City | city | Cheyenne | Akila |
| Neon | city | Volii | Volii Alpha |
| The Key | starstation | Kryx | — |
| Deimos Staryard | staryard | Sol | Deimos* |
| Red Mile | settlement | Porrima | Porrima III* |
| Paradiso | settlement | Porrima | Porrima II |
| Dazra | city | Lantana | Dazra |
| Dazra (Kavnyk) | city | *unmapped* | *unmapped* |

\* Planet id not in `planetData` — renders via safe display-name fallback.

### Helpers
`getLocationsForSystem`, `getLocationsForPlanet`, `getLocationCountForSystem`, `getLocationCountForPlanet`, `getLocationsByType`, `getPlanetDisplayName`, `formatLocationMeta`, `renderSystemDetailsLocations`

### Save rules
- `gameProgress.locations` remains `{}` — not written
- No map re-render for location data (details panel only)

## QA Summary

**PASS** — 15/15 automated checks (2026-06-06).

Verified: app load, system/mission tabs, locations panel, starter data, empty systems, unknown planet ids, save envelope unchanged, old saves load, mission badges, system search.

**Follow-up fix (same day):** Roman numeral fallback casing — see `2026-06-06-planet-display-name-roman-numerals.md`. Re-verified 15/15.

## Known Issues

- Location catalogue is starter-only (10 entries)
- Unmapped Kavnyk reference not shown on any system panel (`systemId: null`)
- Location filters and progress tracking deferred to future phases
- ~~Unknown planet id Roman casing~~ — fixed in planet display name patch

## Next Phase Recommendation

1. Expand `locationData` from game reference material
2. Wire `gameProgress.locations` for visited/completed POI state
3. Optional: location markers on map (without full re-render churn)
