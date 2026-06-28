# Feature Report — Knowledge Atlas Expansion Pack 1 (Phase 27)
Date: 2026-06-28

## What Changed

Expanded `knowledgeData` from 8 starter entries to **22 validated Pack 1 entries**: major vendors, full companion roster, player homes, city-level magazine indexes, and power/temple framework rows. Fixed Neon planet links to use `volii_alpha` (matching `locationData`).

## Why It Matters

Players can now use the Knowledge Atlas during a normal playthrough to find Trade Authority kiosks, Akila/Neon/New Atlantis vendors, companions, homes, and where to start looking for magazines — without leaving the app or changing save architecture.

## Files Updated

- `Starmap - Fav v3 .html` — `knowledgeData` Pack 1, starter hint text
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-phases-23-25-check.js`, `scripts/qa-phase-27-check.js` (new)

## User-Facing Behaviour

### Pack 1 catalogue (22 entries)

| Category | Count | Examples |
|----------|-------|----------|
| Companions | 5 | Sarah Morgan, Barrett, Sam Coe, Andreja, Vasco |
| Player homes | 3 | Mercury Tower Penthouse, Neon Sleepcrate, Dream Home |
| Vendors | 9 | Jemison Mercantile, UC Distribution, Trade Authority (×3 cities), Sieghart's, Newill's, Shepherd's, The Lodge |
| Magazines | 3 | Starter indexes for New Atlantis, Neon, Akila City |
| Powers / temples | 2 | Framework rows only (no guessed temple sites) |

- **Show on Map** works when `systemId` is set (19 entries)
- **Show on Map unavailable** for framework rows and entries without a fixed system link (3 entries)
- Search, category filters, system details integration, and Clear filters unchanged

### Null / unmapped by design

| Entry | Null field | Reason |
|-------|------------|--------|
| Barrett, Vasco | `locationId` | Recruited on Vectera — no vendor POI in catalogue |
| Dream Home | `locationId` | Plot varies by playthrough |
| Powers framework | `systemId` | Individual powers not mapped in Pack 1 |
| Temples framework | `systemId` | Temple POIs not guessed |

## Technical Notes

- All entries use `{ id, type, title, systemId, planetId, locationId, description, tags }`
- Vendor rows link to existing `locationData` city/settlement POIs — no new shop locations added
- Sam Coe updated with `locationId: 'akila_city'` (safe link)
- Neon entries use `planetId: 'volii_alpha'` + `locationId: 'neon_city'`
- **Not saved** — `knowledgeData` remains read-only; no save migration

## QA Summary

**Verdict: PASS** (automated)

Pre-expansion: catalogue validation clean (0 duplicate ids, 0 orphan refs in existing data).

| Script | Result |
|--------|--------|
| `qa-phase-27-check.js` | 26/26 |
| `qa-static-check.js` | 51/51 |
| `qa-migration-check.js` | 16/16 |
| Full suite (22–27) | **141/141** |
| `qa-phases-23-25-check.js` | 19/19 |

Validated: no duplicate knowledge ids, no orphan system/planet/location refs, all Pack 1 required ids present, save envelope unchanged.

## Known Issues

- Individual magazine issues not mapped — city starter indexes only
- Temple/power framework rows have no Show on Map
- Vendor entries point to city POIs, not shop-level locations
- See `docs/known-issues.md`

## Next Phase Recommendation

**Knowledge Atlas Pack 2** — individual skill magazines with validated locations, ship vendors, trainers, and unique gear entries.
