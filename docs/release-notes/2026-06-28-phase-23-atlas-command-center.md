# Feature Report — Atlas Command Center (Phase 23)
Date: 2026-06-28

## What Changed

Added an eighth tab — **Command Center** — that unifies missions, surveys, outposts, discoveries, resources, and universe progress into one actionable dashboard.

## Why It Matters

The atlas now has rich data across many tabs. The Command Center answers “what should I do next?” without hunting through Missions, Galaxy Progress, Resources, Outposts, Discoveries, and Universes separately.

## Files Updated

- `Starmap - Fav v3 .html` — Command Center tab, panel, recommendation helpers, layout CSS
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-static-check.js` — Command Center DOM + pan-ignore checks

## User-Facing Behaviour

### Command Center tab (last in view switcher)
1. **Recommended Actions** — priority list (missions per system, survey near-complete, outpost review, faction questlines, recent discoveries)
2. **Continue Playing** — mission, system, planet + **Show on Map**
3. **Exploration Opportunities** — closest-to-completion survey % per system; click opens map + details
4. **Resource Watchlist** — Helium-3, Titanium, Iron, Water with catalogue systems
5. **Faction Progress Snapshot** — Main Quest + faction campaign bars
6. **Discovery Highlights** — recent journal entries
7. **Universe Snapshot** — active universe, blended completion %, active missions, surveyed planets, locations completed

Every card supports **Show on Map** and/or **Open Details** (or tab jump to Missions / Discoveries / Universes where map focus does not apply).

## Technical Notes

- `getCommandCenterRecommendations()` — read-only aggregation; no duplicate catalogues
- `computeSystemSurveyPercent()` — sums survey found/total across catalogue planets in a system
- `COMMAND_CENTER_WATCHLIST` — runtime constant; not persisted
- `refreshCommandCenterIfVisible()` — updates dashboard when progress changes while tab is open
- No map coordinate, spacing, or save envelope changes

## QA Summary

Static checks: 34 passes (JS parse, Command Center DOM, pan ignore, migration 8/8).

## Known Issues

Recommendation ordering is heuristic — see `docs/known-issues.md`. Command Center browser smoke deferred to manual check.

## Next Phase Recommendation

Optional: pin a custom resource watchlist per session (still not saved) or deep-link from recommendations into filtered Missions list.
