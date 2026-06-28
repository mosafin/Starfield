# Feature Report — Location Atlas Expansion Pack 1 (Phase 33)
Date: 2026-06-28

## What Changed

Expanded the **Core Atlas** location catalogue from **53 → 63** validated named POIs (+10), standardised location categories, strengthened mission/knowledge cross-links, and extended Atlas Manager coverage statistics for location expansion planning.

## Why It Matters

Planet coverage reached 100% in Phase 32. Phase 33 increases meaningful visitable destinations in priority gameplay systems without guessing shop interiors or procedural settlements.

## Catalogue Totals

| Catalogue | Before | After |
|-----------|--------|-------|
| Locations | 53 | **63** |
| Systems with named POIs | 22 | **22** (deeper coverage in existing hubs) |
| Location coverage (systems) | ~18% | **~18%** (named POIs only) |

## New POIs (validated)

| ID | Name | System | Type |
|----|------|--------|------|
| `the_scow` | The Scow | Alpha Centauri | starstation |
| `apollo_landing_site` | Apollo Landing Site | Sol | landmark |
| `london_landmark` | London Landmark | Sol | landmark |
| `siren_of_stars` | Siren of Stars | Kryx | starstation |
| `codos` | Codos | Porrima | settlement |
| `freestar_rangers_hq` | Freestar Rangers HQ | Cheyenne | district |
| `neon_medical_center` | Neon Medical Center | Volii | hospital |
| `cydonia_military_district` | Cydonia Military District | Sol | military |
| `kryx_fleet_administration` | Crimson Fleet Administration | Kryx | military |
| `mercury_tower` | Mercury Tower | Volii | district |

## Category standardisation

Retyped existing entries where validated: New Atlantis/Neon districts, Argos Extractors (mine), Entangled site (lab), Tau Gourmet (factory), Mantis lair (quest).

## Atlas Manager

- `getAtlasStatistics()` — `namedLocations`, `locationsPerSystem`, `coverageByCategory`, `averages.namedLocationsPerSystem`
- `getExpansionReadiness()` — `systemsWithNoNamedLocations`, `systemsWithOnlyOneLocation`, `largestLocationGaps`

## Priority systems expanded

Alpha Centauri, Sol, Narion, Cheyenne, Volii, Kryx, Porrima, Wolf, Tau Ceti, Masada, Schrodinger, Jaffa, Freya.

**Remaining gaps:** Serpentis (0 named POIs — no validated mission refs); ~98 systems with planets but no named surface POI.

## Save / UI

- Save v2 unchanged — catalogue only
- No UI layout changes

## QA

- `qa-phase-33-check.js` — **27/27**
- Static check location minimum raised to **62**
