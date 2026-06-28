# Feature Report — Atlas Polish Release 1 (Phase 26)
Date: 2026-06-28

## What Changed

Stabilisation pass after Phases 22–25: compact **More ▾** view navigation, performance caches, save v2 QA hardening, catalogue readiness report, Knowledge Atlas polish, and documentation sync.

## Why It Matters

The atlas now has ten views, four catalogues, faction overlays, and save v2. This release makes navigation usable again, reduces unnecessary work on hot paths, and prepares for the next content expansion (Knowledge Atlas Pack 1).

## Files Updated

- `Starmap - Fav v3 .html` — view More menu, performance caches, `getAtlasDataReadinessReport()`, Knowledge polish
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-static-check.js`, `scripts/qa-migration-check.js`, `scripts/qa-phases-23-25-check.js`, `scripts/qa-phase-26-check.js`

## User-Facing Behaviour

### View navigation
- **Always visible:** Star Systems · Missions · Galaxy Progress · Command Center · **More ▾**
- **More menu:** Resources · Outposts · Discoveries · Universes · Route Planner · Knowledge Atlas
- When a secondary view is active, the More button shows its name (e.g. **Resources ▾**)
- Universe selector and search bar unchanged; all ten views remain reachable

### Knowledge Atlas polish
- **Clear filters** button when search/category/type filters are active
- Improved empty-state messages
- Starter catalogue hint when showing all 8 entries
- Entries without a linked system show “Show on Map unavailable”

### Developer diagnostics
- Run `getAtlasDataReadinessReport()` in the console (localhost / file / `?catalogueDev=1` or `?uiDev=1`)
- Reports catalogue counts, duplicate ids, orphan refs, missing map refs, and expansion readiness

## Technical Notes

- `syncViewSwitcherUi()` / `initViewTabsMoreMenu()` — secondary view grouping
- `systemById` index — O(1) lookup in `applyMapPointVisualState()`
- `invalidateCommandCenterCache()` — recommendation cache invalidated on `saveSystemStates()`
- `routePlannerPathCacheKey` — skips redundant Dijkstra when inputs unchanged
- `knowledgeFilteredCache` — skips re-filter on unchanged filter state
- No save envelope changes; no map coordinate or spacing changes

## QA Summary

**Verdict: PASS WITH CAVEATS** (2026-06-28 QA Agent review)

| Script | Result |
|--------|--------|
| `qa-static-check.js` | 50/50 |
| `qa-migration-check.js` | 16/16 |
| `qa-phase-22-check.js` | 9/9 |
| `qa-phases-23-25-check.js` | 19/19 |
| `qa-phase-26-check.js` | 20/20 |
| **Total automated** | **114 passes, 0 failures** |

Verified by static/code review: view More menu wiring, save v2 envelope unchanged, performance caches, catalogue readiness report, Knowledge polish, no map coordinate changes.

**Not live-tested:** folder save/load E2E, pan/zoom manual smoke, `getUILayoutReport()` overlap audit at 1920×1080 / 768px. See `docs/known-issues.md`.

## Known Issues

See `docs/known-issues.md` — folder save E2E and pan/zoom manual smoke remain deferred.

## Next Phase Recommendation

**Knowledge Atlas Expansion Pack 1** — expand `knowledgeData` with validated vendor, magazine, and power entries linked to `locationId` / `systemId`.
