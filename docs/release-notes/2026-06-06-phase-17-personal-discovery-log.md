# Feature Report — Personal Discovery Log (Phase 17)
Date: 2026-06-06

## What Changed

Added a personal **Discovery Journal** with quick-add from system/planet/location views, a **Discoveries** tab with search and filters, statistics, and **Show on Map** integration.

## Why It Matters

Players can record favourite vendors, unique gear, hidden spots, and memorable finds — then search, filter, and jump back to the linked system without leaving the atlas.

## Files Updated

- `Starmap - Fav v3 .html` — discovery store, modal, journal tab, quick-add buttons
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- **+ Discovery** in system details, expanded planet view, and expanded location view
- Modal: title, type (landmark, vendor, weapon, armor, ship, resource, outpost, companion, easter egg, custom), long-form note
- **Discoveries** tab — total count, breakdown by type, most documented systems, recent list
- Filters: type, system, planet, date added; live search on title and notes
- **Show on Map** per entry — opens Star Systems, focuses system, opens details panel

## Technical Notes

- Top-level save envelope unchanged: `{ systems, missions, planets, locations }`
- Journal stored at `gameProgress.locations.__discoveryJournal__` with `{ entries: [...] }`
- Reserved key skipped by location progress merge/read/save helpers
- `mergeDiscoveryJournal()` merges entries by id on import
- No new map layers or highlight changes

## QA Summary

Static review: save shape, merge path, filters, Show on Map, and isolation from location progress verified.

## Known Issues

- No in-journal edit/delete UI yet (add-only)
- Planet filter lists catalogue planets for selected system, or planets referenced in existing discoveries when system is “all”

## Next Phase Recommendation

Edit/delete discoveries in journal; optional link from discovery card to resource atlas or outpost planner.
