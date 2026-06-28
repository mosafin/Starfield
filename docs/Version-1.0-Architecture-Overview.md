# Version 1.0 Architecture Overview

Starfield Starmap Explorer is a **single HTML file** offline atlas and progress tracker. **Version 1.0.0 RC** is production-ready for player testing.

**Version:** `ATLAS_APP_VERSION = '1.0.0'` · **Save:** v2

## Layers

```
┌─────────────────────────────────────────────────────────┐
│  UI Views (tabs / More menu)                            │
│  Systems · Missions · Progress · Command · More…        │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Presentation                                           │
│  Panels · modals · galactic search · map layers          │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Runtime indexes (atlasIndexes)                         │
│  systems · planets · locations · missions · knowledge    │
│  search index · fleet indexes                            │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Catalogue data (read-only)                             │
│  core arrays + loaded packs (shattered-space)            │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Save v2 (player progress)                              │
│  universes · masterAtlas · fleet/crew/homes per universe │
└─────────────────────────────────────────────────────────┘
```

## Atlas Registry (Phase 31+)

| Slot | Content |
|------|---------|
| `core` | 120 systems, planets, locations, missions, resources |
| `knowledge` | Knowledge Atlas entries |
| `shattered-space` | DLC missions, Lantana bodies, SS locations |
| `community` | Reserved for future packs |

`loadAtlasPack()` merges into working arrays → `rebuildAtlasIndexes()` → `buildSearchIndex()`.

## Intelligence (generated, not saved)

| Module | Function |
|--------|----------|
| Command Center | `getCommandCenterRecommendations()` |
| Insights | `getAtlasInsightsCached()` |
| Health | `getAtlasHealthReport()` |

Caches invalidate on save change or catalogue rebuild.

## Search

`buildSearchIndex()` + dynamic entries (discoveries, routes, timeline, fleet) → `searchGalactic()`.

## Constraints (do not break)

- Save **v2** schema
- Vanilla **star coordinates** and Phase 9 spacing
- No server calls — offline only
- Catalogue-only expansion — no guessed POIs

## Release Candidate checklist

- [ ] Existing saves load
- [ ] All QA scripts pass
- [ ] `validateAtlas()` valid
- [ ] `getAtlasHealthReport()` no critical warnings
- [ ] Keyboard shortcuts work
- [ ] No top-bar overlap at 1280–1920px
- [ ] Map pan/zoom/save/note flows intact
