# Feature Report — Phase 9 Data Expansion Framework
Date: 2026-06-06

## What Changed

Added a catalogue indexing and validation layer so planet and location data can scale from dozens to hundreds of entries without repeated array scans or silent data errors. Map label overlap spacing was also increased slightly.

## Why It Matters

Expanding the Starfield atlas previously meant more `filter()` calls on every details-panel open and no automated checks for broken references. Indexes and dev-mode validation make bulk catalogue imports safer and keep panel rendering fast at scale.

## Files Updated

- `Starmap - Fav v3 .html` — indexes, validation, health report, lookup refactors, label offset tuning
- `README.md` — catalogue dev notes
- `CONTEXT.md` — indexing and validation reference
- `docs/known-issues.md` — catalogue validation findings
- `memory/README.md` — project memory update

## User-Facing Behaviour

**No UI changes.** Details panel, map layers, search, and progress tracking behave the same.

**Map labels:** Star system names are nudged apart slightly more in crowded regions (label offset algorithm: `minDist` 3.2→4.4, `pushStrength` 0.45→0.55).

**Developers:** On localhost, `file://`, or with `?catalogueDev=1`, the browser console prints:

```
Starfield Catalogue Stats

Systems: 120
Planets: 45
Locations: 10
Missions: 122

Orphan Planets: 0
Orphan Locations: 2
Duplicate IDs: 0
Validation Issues: 2
```

Disable with `?catalogueDev=0`.

## Technical Notes

### Indexes (built once at load via `buildCatalogueIndexes()`)
| Index | Purpose |
|-------|---------|
| `planetById` | O(1) planet lookup |
| `locationById` | O(1) location lookup |
| `planetsBySystemId` | Planets per system (details panel) |
| `locationsBySystemId` | Locations per system |
| `locationsByPlanetId` | Locations per planet |
| `locationsByType` | Global type grouping |
| `systemLocationIndex` | Map layer type counts (unchanged behaviour) |

### Validation (dev mode only)
- `validatePlanetData()` — duplicate ids, missing/unknown `systemId`, invalid types
- `validateLocationData()` — duplicate ids, unknown `systemId`/`planetId`, invalid types, orphaned `relatedMissionIds`, mission `systemId` refs
- `getCatalogueHealthReport()` / `logCatalogueHealthReport()` — summary stats

### Refactored lookups
- `getPlanetsForSystem`, `getLocationsForSystem`, `getLocationsForPlanet`, `getLocationsByType`, `getPlanetDisplayName`, `savePlanetState`, `saveLocationState`, `refreshPlanetCatalogMetaInPanel` — use indexes instead of `filter()` / `find()`

### Save safety
- No save format changes
- No new save keys
- No migration changes

## QA Summary

**PASS** — 22/23 automated checks (2026-06-06); one test used outdated planet count (44 vs 45 in catalogue).

Verified: indexes match filter behaviour, details panel unchanged, map layers, search, mission badges, planet/location progress, save envelope unchanged, health report counts correct, validation flags 2 pre-existing location→planet reference gaps.

## Known Issues

Starter catalogue validation reports:
- `deimos_staryard` → unknown `planetId` `deimos`
- `red_mile` → unknown `planetId` `porrima_iii`

These are catalogue data gaps, not runtime bugs. Add matching `planetData` entries to clear warnings.

## Next Phase Recommendation

1. Bulk-expand `planetData` and `locationData` using validation to catch broken refs
2. Add missing planet entries for Deimos and Porrima III
3. Optional `locationsByType` map-layer index if global type queries grow
