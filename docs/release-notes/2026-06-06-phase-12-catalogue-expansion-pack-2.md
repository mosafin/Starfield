# Feature Report — Planet & Location Catalogue Expansion Pack 2 (Phase 12)
Date: 2026-06-06

## What Changed

Expanded read-only `planetData` and `locationData` for 12 frequently visited systems plus major Neon and Akila POIs. Added **82** planets/moons and **13** locations. No UI, save envelope, map coordinates, or Phase 9 spacing changes.

## Why It Matters

Wolf, Tau Ceti, Groombridge, Jaffa, and other common travel systems now show useful body lists and landmarks in system details — including The Den (Wolf), Ryujin Tower, Ebbside, Akila City sites, and Tau Ceti II settlements.

## Files Updated

- `Starmap - Fav v3 .html` — expanded catalogues
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`

## Catalogue Counts

| Catalogue | Phase 11 | Phase 12 |
|-----------|----------|----------|
| Planets/moons | 67 | **149** (+82) |
| Locations | 24 | **37** (+13) |

## Systems Expanded (planets)

Wolf, Tau Ceti, Groombridge, Jaffa, Eridani, Valo, Piazzi, Olympus, Schrodinger, Feynman, Serpentis, Bohr.

## New Locations (13)

| Location | System | Notes |
|----------|--------|-------|
| The Den (`the_den_wolf`) | Wolf / Chthonia | Canonical smuggler hub; separate from Narion `the_den` |
| Ryujin Tower | Volii | Ryujin Industries missions |
| Astral Lounge, Trade Tower, Ebbside | Volii / Volii Alpha | Neon districts |
| The Rock, Coe Heritage Museum | Cheyenne / Akila | Akila City landmarks |
| Lopez Farm, Tau Gourmet Production Center | Tau Ceti / Tau Ceti II | Settlement anchors |
| Lair of the Mantis | Jaffa / Jaffa III | Quest location |
| Vulture's Roost | Jaffa / Jaffa II | Settlement |
| The Almagest | Olympus | Orbital; `planetId: null` |
| The Colander | Schrodinger | `planetId: null` |

## User-Facing Behaviour

- Open ℹ on Wolf, Tau Ceti, Jaffa, etc. to see expanded planet lists and new POI groups.
- Volii and Cheyenne gain additional location entries alongside existing Pack 1 data.
- Progress tracking unchanged — catalogue is read-only until the player edits status/notes.

## Technical Notes

- New Pack 2 bodies use `level: null` and `resources: []` unless already catalogued in Pack 1.
- Named Wolf bodies: Chthonia, Etherea, Pontem (existing `wolf_i` retained for save compatibility).
- Intentional **null `planetId`:** The Almagest, The Colander (orbital/system POIs).
- **Uncertain body placement** documented in location `notes`: Mantis Lair (Jaffa III), Vulture's Roost (Jaffa II), Tau Ceti II settlements.
- **Duplicate Den entries:** `the_den` (Narion/Kreet, Pack 1) and `the_den_wolf` (Wolf/Chthonia) both exist; missions reference Wolf.

## QA Summary

Static validation: **149** planets, **37** locations, **0** duplicate ids, **0** orphan refs, **0** invalid types.

## Known Issues

- Most new bodies lack level/resource data (`null` / `[]`).
- `wolf_i` remains a legacy catalogue id alongside Chthonia.
- Moon/planet assignment for Pontem and some POI body anchors is approximate.

## Next Phase Recommendation

Expansion Pack 3 for remaining mid-traffic systems (Andromas, Altair, Barnard's Star, Delta Pavonis); add more activity/vendor POIs where mission catalogue supports them.
