# Feature Report — Outpost Planning & Colony Builder (Phase 16)
Date: 2026-06-06

## What Changed

Added optional **outpost planning** fields on planet progress, an **Outpost Planning** panel in the planet drilldown, a galaxy-wide **Outposts** tab with summary stats and resource coverage, and a **Planned Outposts** map layer.

## Why It Matters

Players can plan future bases and resource networks offline — mark strategic planets, set priorities, write long-form notes, and see which systems matter — without changing the save envelope or map layout.

## Files Updated

- `Starmap - Fav v3 .html` — outpost state, drilldown UI, Outposts tab, map layer
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- Expand a planet → **Outpost Planning**: Planned Outpost checkbox, name, priority (Low / Medium / High), notes textarea
- **Outposts** tab — Planned Outposts total + High / Medium / Low counts; cards list system, planet, resources, notes
- **Show on Map** on each outpost card
- Map layers → **Outposts** → **Planned Outposts** highlights matching systems

## Technical Notes

- Top-level save envelope unchanged: `{ systems, missions, planets, locations }`
- Outpost fields on `gameProgress.planets[id]`: `plannedOutpost`, `outpostName`, `priority`, `notes`
- Created only via `savePlanetOutpostPlan()` on first edit (same pattern as survey)
- `mergePlanetStates()` merges flat outpost fields via spread with existing planet entries
- Map layer id: `planned_outposts`; helper: `systemHasPlannedOutpost(systemId)`
- Resource list on outpost cards from `planetData.resources` — not saved separately

## QA Summary

Static review: save shape, merge path, layer match, tab switching, and drilldown panel wiring verified.

## Known Issues

- Outpost resources show catalogue data only — empty when `planetData.resources` is `[]`
- Mobile Outposts tab layout not browser-verified

## Next Phase Recommendation

Optional filters on Outposts tab (priority, resource type); link high-priority outposts to resource atlas highlight.
