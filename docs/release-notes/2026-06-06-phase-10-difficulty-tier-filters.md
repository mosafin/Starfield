# Feature Report — Difficulty Tier Filters (Phase 10)
Date: 2026-06-06

## What Changed

Added a **Difficulty** group to the Map layers panel with six tier toggles (1–5 + Main), three quick actions, and a difficulty tier line in the system details panel.

## Why It Matters

Players can isolate low-level starter systems, high-level danger zones, or Sol/main systems without changing the map layout or Phase 9 spacing.

## Files Updated

- `Starmap - Fav v3 .html` — layer definitions, matching logic, quick actions, details panel
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`

## User-Facing Behaviour

- Map layers → **Difficulty**: Level Tier 1–5 / Main checkboxes
- Quick actions: **Show low-level systems**, **Show high-level systems**, **Clear difficulty filters**
- Details panel shows e.g. `Difficulty Tier: 1 / Green` or `Difficulty Tier: Main / Cyan`
- Filters combine with search and other layers (OR within active layers); runtime only, not saved

## Technical Notes

- Layer IDs: `difficulty_1` … `difficulty_5`, `difficulty_main`
- Matching uses existing `system.point` values
- Low-level quick action: tiers 1, 2, main; high-level: tiers 4, 5
- Highlight classes unchanged (`.layer-match`, `.layer-faded`, search classes)

## QA Summary

Automated smoke: tier filters, multi-select, search combo, save envelope unchanged, spacing intact.

## Known Issues

None specific to this phase.

## Next Phase Recommendation

Optional tier indicator on map labels for systems without opening details.
