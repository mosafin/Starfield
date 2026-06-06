# Feature Report — Planet & Location Catalogue Expansion Pack 1 (Phase 11)
Date: 2026-06-06

## What Changed

Expanded read-only `planetData` and `locationData` for 13 priority gameplay systems. Added 22 planets/moons and 14 major POIs. Fixed prior validation gaps (`deimos`, `porrima_iii`). No UI, save envelope, system coordinates, or Phase 9 spacing changes.

## Why It Matters

Opening system details for Sol, Narion, Cheyenne, Alpha Centauri, and other core systems now shows a richer planet list and major settlements/stations — useful during actual play without requiring the player to track catalogue data separately.

## Files Updated

- `Starmap - Fav v3 .html` — expanded `planetData` (+22) and `locationData` (+14); validation refs resolved
- `README.md` — catalogue counts and expanded system list in Save & Load / features
- `CONTEXT.md` — catalogue counts, `level: number|null`, Pack 1 priority systems, null `planetId` notes
- `docs/known-issues.md` — partial catalogue status; resolved deimos/porrima validation gaps
- `memory/README.md` — latest release note pointer and catalogue counts

## User-Facing Behaviour

- **System details (ℹ)** on priority systems shows more planets/moons and grouped locations (cities, settlements, landmarks, staryards, etc.).
- **Alpha Centauri** example: 8 bodies, 6 POIs including The Lodge, The Eye, MAST District, Gagarin Landing, New Homestead.
- **Sol** example: 12 bodies including Deimos (fixes Deimos Staryard linkage).
- Planet/location **status and notes** behave as before — catalogue names appear even when not in your save.
- Opening details **does not** add entries to your save until you change a status or note.
- Map layers, difficulty filters, search, mission badges, and spacing unchanged.

## Catalogue Counts

| Catalogue | Before | After |
|-----------|--------|-------|
| Planets/moons | 45 | **67** |
| Locations | 10 | **24** |

### Priority systems expanded

Sol, Alpha Centauri, Narion, Cheyenne, Volii, Porrima, Kryx, Indum, Oborum Prime, Freya, Masada, Lantana, Nirvana.

### New locations (14)

The Lodge, The Eye, MAST District, Gagarin Landing, New Homestead, Hopetown, The Clinic, The Well, Stroud-Eklund Staryard, The Den, Trident Luxury Lines Staryard, UC Vigilance, Eleos Retreat, Crucible.

## Technical Notes

- Catalogue entries use `{ id, name, systemId, type, level, resources }` (planets) and `{ id, name, type, systemId, planetId, relatedMissionIds, tags, notes }` (locations).
- Unknown **level** → `null`; unknown **resources** → `[]` (no guessing).
- **Intentional null `planetId`:** orbital POIs (Stroud-Eklund Staryard, Trident Staryard, UC Vigilance, Crucible, The Key); DLC ref `dazra_kavnyk` keeps `systemId: null`.
- **Documented catalogue/mission mismatches** (in location `notes`):
  - The Well on Volii Alpha; mission `alternating_currents` lists Alpha Centauri.
  - The Den on Kreet (Narion); some missions list Wolf.
- Validation unchanged: `buildCatalogueIndexes()`, `validatePlanetData()`, `validateLocationData()`, `logCatalogueHealthReport()` at `?catalogueDev=1`.
- Save envelope unchanged: `{ systems, missions, planets, locations }`.

## QA Summary

**Result: PASS** (2026-06-06)

| Area | Result |
|------|--------|
| Catalogue validation | PASS — 0 duplicate ids, 0 orphan refs, 0 validation issues |
| Save pollution | PASS — opening details on clean save leaves `planets`/`locations` empty |
| Player edit → save | PASS — status change creates one progress entry as expected |
| Map render | PASS — 120 systems; re-render stable |
| Phase 10 regression | PASS — difficulty layers, low/high shortcuts, details tier line |
| Phase 9 regression | PASS — anchor at x/y, 21 manual offsets, no `computeMapLabelOffsets` |
| Search + layers | PASS — search highlight; city/difficulty layers match expected counts |
| Console | PASS — no JS errors on load or catalogue/render calls |

**Automated:** 64 static checks + 11 browser runtime assertions.

**Deferred (unchanged):** pan/zoom manual smoke, folder save/load in Chrome, mobile layout — see `docs/known-issues.md`.

**Bugs found:** none blocking.

## Known Issues

- Most of the 120 systems still have no catalogue entries (Pack 1 prioritised 13 core systems).
- Mission catalogue vs location placement mismatches for The Well and The Den (documented in POI notes).
- Label overlap may remain in dense clusters on small viewports (Phase 9 offsets help but do not eliminate).

## Next Phase Recommendation

**Expansion Pack 2** — extend `planetData` / `locationData` for the next tier of frequently visited systems (e.g. Groombridge, Wolf, Jaffa, Tau Ceti). Optional POIs: Ryujin Tower, more Freestar settlements. Keep the same validation and save-safety rules.
