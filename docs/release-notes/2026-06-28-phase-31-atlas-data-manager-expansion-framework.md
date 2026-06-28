# Feature Report — Atlas Data Manager & Expansion Framework (Phase 31)
Date: 2026-06-28

## What Changed

Introduced a central **Atlas Registry**, unified **validateAtlas()** pipeline, **getAtlasStatistics()**, **getExpansionReadiness()**, consolidated **rebuildAtlasIndexes()** index manager, lazy-pack architecture stubs, and **AtlasManager** developer console — without changing save v2 or player UI.

## Why It Matters

Future work is primarily catalogue expansion (1000+ knowledge entries, hundreds of locations, DLC/community packs). Phase 31 prepares the codebase to scale data volume without another major refactor.

## Files Updated

- `Starmap - Fav v3 .html` — registry, validation, statistics, expansion readiness, index manager, dev console
- `README.md`, `CONTEXT.md`, `memory/README.md`, `docs/known-issues.md`
- `scripts/qa-phase-31-check.js` (new), `scripts/qa-static-check.js`
- `docs/release-notes/2026-06-28-phases-22-31-release-summary.md`

## Atlas Registry

`atlasRegistry` describes every catalogue: systems, planets, locations, missions, resources (derived), knowledge — with pack ids (`core`, `knowledge`) for future modular loading.

## Validation Pipeline

`validateAtlas()` replaces scattered one-off checks:

- Duplicate IDs (systems, missions, planets, locations, knowledge)
- Orphan system/planet/location references
- Invalid location/knowledge categories
- Unknown factions (knowledge + system metadata)
- Invalid related entry/mission links

Legacy `getAtlasDataReadinessReport()` delegates to `validateAtlas()` + `getExpansionReadiness()`.

## Index Manager

All lookup indexes live in `atlasIndexes`. **Single rebuild:** `rebuildAtlasIndexes()` (alias: `buildCatalogueIndexes()`). Added `missionsBySystemId` for O(1) mission lookups.

## Expansion Framework

- `getAtlasStatistics()` — counts, averages, coverage %
- `getExpansionReadiness()` — gap lists (systems without planets, planets without locations, etc.)
- `atlasPackSlots` — core, knowledge (loaded), dlc, community (reserved)
- `registerAtlasPack()` / `loadAtlasPack()` — stubs for future modular imports

## Developer Console

On load (`file://`, localhost, or `?catalogueDev=1`):

```js
AtlasManager.validateAtlas()
AtlasManager.getAtlasStatistics()
AtlasManager.getExpansionReadiness()
AtlasManager.rebuildAtlasIndexes()
AtlasManager.measureAtlasPerformance()
```

## QA Summary

**Verdict: PASS**

| Script | Result |
|--------|--------|
| `qa-phase-31-check.js` | 25/25 |
| Full suite (22–31) | **250/250** (static 53 + migration 16 + phases) |

## Known Issues

- Modular pack **loading** not implemented — architecture only
- `loadAtlasPack()` returns `not_implemented` until a future phase merges pack arrays

## Next Phase Recommendation

**Knowledge Atlas Pack 3** or first **DLC pack loader** — implement `loadAtlasPack()` merge + validation hook when new validated POI data is ready.
