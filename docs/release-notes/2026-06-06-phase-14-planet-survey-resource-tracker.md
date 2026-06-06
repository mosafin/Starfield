# Feature Report — Planet Survey & Resource Tracker (Phase 14)
Date: 2026-06-06

## What Changed

Added optional **survey tracking** per planet (flora, fauna, resources, traits found/total), automatic **Overall Survey** percentage, map **Survey** and **Resources** layer filters, and **Planets Surveyed** system summary. Catalogue resources display in expanded planet view.

## Why It Matters

Completion runners can track scan progress per body and filter the map for systems with survey data, iron/water planets, or finished surveys — without leaving the offline atlas.

## Files Updated

- `Starmap - Fav v3 .html` — survey state, UI, layers, merge logic
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- Expand a planet → **Survey Progress** inputs (found / total per category)
- **Overall Survey: N%** updates live; **✓ Survey Complete** at 100% when totals > 0
- **Resources** list from `planetData.resources` when catalogue has entries
- System panel: **Planets Surveyed: X / Y**
- Map layers → **Survey** and **Resources** groups (resource toggles only if catalogue contains that resource)

## Technical Notes

- Top-level save envelope unchanged: `{ systems, missions, planets, locations }`
- `survey` nested under `gameProgress.planets[id]` — created only via `savePlanetSurvey()`
- **Completion formula:** `(floraFound + faunaFound + resourcesFound + traitsFound) / (floraTotal + faunaTotal + resourcesTotal + traitsTotal) × 100`, rounded; 0% if no totals set
- `mergePlanetStates()` deep-merges `survey` for import/export
- Old saves without `survey` load unchanged

## QA Summary

Static review: survey helpers, layer matching, drilldown integration, merge path verified.

## Known Issues

- Survey totals are manual entry (not pulled from game API)
- Resource filters match catalogue `planetData.resources`, not player survey resource counts

## Next Phase Recommendation

Optional per-resource “found” checkboxes tied to catalogue resource list.
