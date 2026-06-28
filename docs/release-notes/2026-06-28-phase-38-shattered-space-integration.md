# Phase 38 — Shattered Space Integration Framework

**Date:** 2026-06-28  
**Scope:** First modular DLC pack integrated through the Atlas Registry expansion framework.

## Summary

Shattered Space catalogue content now lives in `atlasPack_shatteredSpace` and loads through `loadAtlasPack()`. Mission Atlas, Knowledge Atlas, Galactic Search, and Timeline consume merged data automatically — no duplicate UI or save migration.

## Pack: `atlasPack_shatteredSpace`

Metadata:

```json
{
  "id": "shattered-space",
  "version": "1.0.0",
  "gameVersion": "1.14",
  "requiredAtlasVersion": 2
}
```

Catalogues (validated entries only — no guessed content):

| Catalogue | Contents |
|-----------|----------|
| Planets | Lantana I–III, Dazra |
| Locations | Dazra City, Hamadi Station, Tomb of the Fang, Dazra (Kavnyk reference) |
| Missions | Shattered Space campaign (8) + SS side quests (3) |
| Knowledge | _(empty — no validated SS knowledge rows yet)_ |
| Systems | _(empty — Lantana map marker stays in Core Atlas)_ |

## Pack Loading

1. `buildAtlasPack_shatteredSpace()` snapshots validated DLC rows from source catalogues
2. `stripCatalogueEntriesForPack()` removes them from core working arrays
3. `bootstrapAtlasPacks()` calls `loadAtlasPack('shattered-space')` before first index build
4. `finalizeCataloguePackChange()` rebuilds indexes + search once per load/unload

Supported pack IDs: `core`, `knowledge`, `shattered-space`, plus `registerAtlasPack()` for future community packs.

## Validation

`validateAtlasPackContent()` checks each pack for:

- Duplicate IDs within the pack
- Orphan system/planet/location/mission/knowledge references
- Cross-pack references (e.g. DLC missions → core `lantana` system)
- Category/type validity
- Mission prerequisite and knowledge link integrity

`validateAtlas()` includes `packValidation` and `loadedPacks` in its report.

## Developer Tools

In catalogue dev mode (`file://`, localhost, or `?catalogueDev=1`):

- **More ▾ → Loaded Packs** — status for Core, Knowledge, Shattered Space, Community
- Load/Unload Shattered Space for testing
- `AtlasManager.loadAtlasPack('shattered-space')`
- `AtlasManager.unloadAtlasPack('shattered-space')` (dev only)
- `AtlasManager.getAtlasPackStatusList()`
- `getAtlasStatistics().loadedPacks` and `.dlc`

## Future Pack Workflow

1. Author catalogue arrays with validated data only
2. `registerAtlasPack(packId, { metadata, systems, planets, ... })` OR add to `ATLAS_BUILTIN_PACKS`
3. `loadAtlasPack(packId)` — validation + merge + single rebuild
4. Extend `ATLAS_PACK_MANIFEST` with a new slot label

## Unchanged

- Save version **v2**
- Vanilla star coordinates and Phase 9 spacing
- Player UI layout (no new permanent tabs)

## QA

Run `node scripts/qa-phase-38-check.js`

**Release summary:** `2026-06-28-phases-22-38-release-summary.md`
