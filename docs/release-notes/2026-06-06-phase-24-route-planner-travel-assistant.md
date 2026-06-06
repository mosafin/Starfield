# Feature Report — Route Planner & Travel Assistant (Phase 24)
Date: 2026-06-06

## What Changed

Added a ninth tab — **Route Planner** — with start/destination selection, multi-stop waypoints, three routing modes, difficulty-aware options, map highlighting, and per-universe saved routes under `gameProgress.routes`.

## Why It Matters

The atlas already knows where missions, resources, and systems are. Route Planner answers “how do I get there?” with coordinate-based path suggestions and optional saved travel plans.

## Files Updated

- `Starmap - Fav v3 .html` — Route Planner UI, Dijkstra routing, map highlight bar, Plan Route buttons
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-static-check.js` — Route Planner DOM, helpers, pan-ignore checks

## User-Facing Behaviour

### Route Planner tab
- **Start / Destination** dropdowns + **Add Stop** for multi-leg routes
- **Direct Route** · **Shortest Jump Path** · **Lowest Difficulty Path**
- Options: Avoid Red / Tier 5 · Prefer Main · Prefer Explored
- Summary: stops, distance, highest tier, explored count, jump path
- **Highlight on Map** + **Reset route** filter bar (existing layer-match style)
- **Save Route** with name/notes → `gameProgress.routes` (universe-scoped)

### Plan Route entry points
- Mission cards and Recommended Next Missions → destination = mission system
- Galaxy Resources card and per-system rows → destination = resource system

## Technical Notes

- No map coordinate or spacing changes
- No new top-level save keys — `routes` lives inside each universe object
- Old saves load with empty `routes: {}` via `ensureUniverseStructure()`
- Universe export includes `routes` when present

## QA Summary

Static checks extended; migration tests unchanged (8/8). Manual smoke: plan Alpha Centauri → Masada, add stops, highlight, save/load route.

## Known Issues

Atlas straight-line routing ≠ in-game lane graph — see `docs/known-issues.md`.

## Next Phase Recommendation

Optional: draw polyline overlay on map for saved routes (still using existing colours).
