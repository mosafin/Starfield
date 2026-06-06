# Feature Report — Planet Display Name Roman Numeral Fix
Date: 2026-06-06

## What Changed

Fixed fallback planet names in the system details **Locations** section when a `planetId` is not yet in `planetData`. Roman numeral segments (e.g. `iii`, `ii`, `iv`) now display as **III**, **II**, **IV** instead of title-cased **Iii**, **Iii**, **Iv**.

## Why It Matters

Location entries such as Red Mile (Porrima III) and Deimos Staryard showed awkward planet labels. Correct casing makes the catalogue readable and matches in-game naming.

## Files Updated

- `Starmap - Fav v3 .html` — `PLANET_ID_ROMAN_NUMERALS`, `formatPlanetIdSegment()`, updated `getPlanetDisplayName()`
- `CONTEXT.md` — function table entry for planet display helpers
- `docs/known-issues.md` — moved issue to Resolved
- `memory/README.md` — QA status and latest release note pointer

## User-Facing Behaviour

Open **ℹ** on **Porrima** → **Locations**:

```
Settlements
  Red Mile
  Porrima III · 1 linked mission
```

Previously showed **Porrima Iii**. Catalogued planets (e.g. Paradiso → Porrima II from `planetData`) are unchanged.

## Technical Notes

- **`PLANET_ID_ROMAN_NUMERALS`** — Set of lowercase segments (`i` through `xii`) uppercased when formatting unknown ids
- **`formatPlanetIdSegment(segment)`** — Applies Roman numeral rule or default title case
- **`getPlanetDisplayName(planetId)`** — Still prefers `planetData[].name`; fallback splits on `_` and maps through `formatPlanetIdSegment`
- No save, state, or map render changes

## QA Summary

**PASS** — 15/15 automated checks (2026-06-06, post-fix verification).

Verified: Porrima III correct casing, no `Porrima Iii`, Deimos/Mars fallbacks, Phase 5 locations panel, save envelope, mission badges, system search, missions tab.

## Known Issues

None introduced. Folder save/load still deferred to manual QA.

## Next Phase Recommendation

Continue Phase 5 follow-up: expand `locationData` and wire `gameProgress.locations` when POI visit tracking is scoped.
