# Starfield Starmap Explorer — Developer Guide

Single-file offline app: `Starmap - Fav v3 .html`. No build step required.

## Dev modes

Enable with `file://`, `localhost`, or query flags:

| Flag | Effect |
|------|--------|
| `?catalogueDev=1` | Atlas validation console, pack toggles, search timing |
| `?uiDev=1` | `getUILayoutReport()` overlap audit |

## AtlasManager API

```js
AtlasManager.validateAtlas()
AtlasManager.getAtlasStatistics()
AtlasManager.getAtlasHealthReport()      // Phase 39 — full health snapshot
AtlasManager.getAtlasCompletenessReport()
AtlasManager.getExpansionReadiness()
AtlasManager.getAtlasInsightsCached()
AtlasManager.loadAtlasPack('shattered-space')
AtlasManager.unloadAtlasPack('shattered-space')  // dev only
AtlasManager.rebuildAtlasIndexes()
AtlasManager.buildSearchIndex()
AtlasManager.searchGalactic('alpha')
AtlasManager.measureAtlasPerformance()
```

## Pack workflow

1. Author validated catalogue rows (no guessed content).
2. Add to `atlasPack_*` or `registerAtlasPack(packId, config)`.
3. Register slot in `ATLAS_PACK_MANIFEST`.
4. `loadAtlasPack(packId)` validates, merges, rebuilds indexes once.
5. Run `validateAtlas()` and `getAtlasHealthReport()`.

## QA scripts

```bash
node scripts/run-full-regression.js      # all phase QA scripts
node scripts/qa-phase-40-check.js        # RC metadata + docs
node scripts/qa-save-compatibility-check.js
node scripts/qa-performance-baseline.js  # writes docs/performance-baseline-v1.0.0.json
```

## Version

```js
AtlasManager.appVersion   // '1.0.0'
AtlasManager.saveVersion  // 2
```

## Keyboard shortcuts (in-app)

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Open Galactic Search |
| Esc | Close topmost overlay |
| ↑ / ↓ | Navigate search results |
| Enter | Open highlighted search result |
| F | Focus selected system on map |
| ? | Shortcut help |
| + / − / 0 | Zoom in / out / reset |

## Layout audit

```js
getUILayoutReport()  // uiDev or catalogueDev
```

## Save safety

- Player progress: `saveRoot` v2 envelope — do not add insight/pack fields to save.
- Catalogue packs are merged at runtime only.

## Further reading

- `CONTEXT.md` — technical inventory
- `docs/Version-1.0-Architecture-Overview.md` — system map
- `memory/README.md` — agent memory index
