# Feature Report — Galaxy Resource Atlas (Phase 15)
Date: 2026-06-06

## What Changed

Added read-only **resource indexes** built from `planetData`, a **Galaxy Resources** tab with live search, system/planet statistics, grouped results, **Show on Map** / **Highlight on Map**, map highlighting via existing layer styles, clickable resources in planet drilldown, and a **Galaxy Progress** summary tab.

## Why It Matters

Players can answer “Where can I find Helium-3?” or “Which systems contain Water?” across the whole catalogue without leaving the atlas — no new save keys or progress tracking.

## Files Updated

- `Starmap - Fav v3 .html` — indexes, views, atlas UI, highlight integration
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- **Resources** tab — search Iron, Aluminum, Copper, Helium-3, Titanium, Nickel, Water; results update live
- Each result shows **Systems: X · Planets: Y** and a **Found on** tree (system → planets)
- **Highlight on Map** fades systems that lack the resource; matching systems use existing purple layer highlight
- **Show on Map** on a planet row pans to the system and opens details (highlight preserved)
- Planet drilldown **Resources** list — click ✓ Iron (etc.) to jump to the atlas for that resource
- **Galaxy Progress** tab — read-only summary of systems, missions, planets, and locations

## Technical Notes

- Indexes (runtime only): `resourcesByPlanet`, `planetsByResource`, `systemsByResource` — built in `buildCatalogueIndexes()`
- `RESOURCE_CATEGORIES` stub for future Metals / Gases / Liquids / Organics / Exotics (not surfaced in UI yet)
- `resourceAtlasHighlightResource` is runtime-only; not saved
- Top-level save envelope unchanged: `{ systems, missions, planets, locations }`
- `systemHasPlanetResource()` uses `systemsByResource` when indexes are ready

## QA Summary

**PASS** — Static re-check after filter fix (2026-06-06). All prior High/Medium bugs resolved.

Verified: index build, highlight lifecycle, reset filter sticky across tabs, drilldown links, save shape, view switching.

## Known Issues

- Nickel may show zero catalogue hits until planet data includes it
- Resource atlas lists catalogue `planetData.resources`, not player survey counts

## QA Fix (2026-06-06)

- Atlas search no longer auto-applies map highlight; only **Highlight on Map** / **Show on Map** do
- **Reset filter** stays cleared when switching Resources ↔ Star Systems tabs
- Partial multi-match searches no longer default-highlight the first resource in the list

## Next Phase Recommendation
Surface `RESOURCE_CATEGORIES` in the atlas UI; optional Titanium/Nickel map layer toggles when catalogue coverage grows.
