# Feature Report — NG+ Universe Tracker (Phase 19)
Date: 2026-06-06

## What Changed

Added four independent universe profiles, a cumulative Master Atlas, universe switcher, Universes tab (dashboard, compare, milestones), and split export (current universe vs full atlas).

## Why It Matters

Players running multiple NG+ cycles can track each playthrough separately while keeping a permanent record of everything they have ever explored across all runs.

## Files Updated

- `Starmap - Fav v3 .html` — save v2, migration, universe UI, export buttons
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- **Current Universe** dropdown — Universe 1–4; switches mission, planet, location, survey, outpost, discovery, and map progress
- **Universes** tab — completion %, compare missions %, NG+ milestones (Unity, level, notes), Master Atlas totals
- **Export Universe** / **Export Atlas** — single profile or full save
- **Save** — writes full atlas (all universes + master record)
- **Fresh Map** — clears map for active universe only; Master Atlas unchanged

## Technical Notes

- New envelope: `{ version, activeUniverseId, universes, masterAtlas }`
- Legacy `{ systems, missions, planets, locations }` auto-migrates to `universes.universe_1`
- `bindActiveUniverse()` rebinds runtime aliases without changing existing save/read helpers
- `updateMasterAtlasFromUniverseData()` runs on every save — additive only
- Universe export: `{ exportType: 'universe', universeId, name, data: { … } }`

## QA Summary

Static review: migration path, alias rebind, master atlas accumulation, view refresh on switch, legacy import merge verified.

## Known Issues

- Fixed four universe slots (not unlimited Universe 7 / 11 from examples — use milestones notes for those labels)
- Compare view shows overall mission % only (not per-faction breakdown)

## Next Phase Recommendation

Custom universe names; import universe into chosen slot; master atlas read-only overlay on map.
