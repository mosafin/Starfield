# Feature Report — Interactive Galaxy Timeline (Phase 29)
Date: 2026-06-28

## What Changed

Added **Galaxy Timeline** — a new **More ▾ → Timeline** view that builds a chronological adventure history from existing save progress. Supports ten event types, date grouping, category filters, search, milestones, and map/mission integration. Minimal optional timestamp fields added on existing nested save objects (not new top-level save keys).

## Why It Matters

Players can answer “when did I complete UC Vanguard?”, “when did I discover Neon?”, and “which systems did I explore recently?” without leaving the atlas.

## Files Updated

- `Starmap - Fav v3 .html` — timeline build/cache/UI, timestamp hooks, view wiring
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-phase-29-check.js` (new)
- `docs/release-notes/2026-06-28-phases-22-29-release-summary.md`

## User-Facing Behaviour

- **More ▾ → Timeline** opens the Galaxy Timeline panel (not a permanent top tab)
- Events generated from missions, planets, locations, discoveries, outposts, systems, knowledge, universes
- Grouped **Today · Yesterday · This Week · Earlier** — collapsible sections
- Filters: Missions · Discoveries · Exploration · Outposts · Knowledge · Survey · Universes
- Search across title, description, system, planet
- **Milestones** chips: first survey, 10 systems explored, 25 missions, 100 discoveries, 50 locations, first outpost
- Actions: Show on Map · Open Details · Open Mission (when linked)
- Timeline list is **generated at runtime** — not a separate saved event log

## Technical Notes

### Event structure (generated)
`{ id, timestamp, type, systemId, planetId, locationId, title, description, missionId? }`

### Event types
| Type | Source |
|------|--------|
| `mission_completed` | `gameProgress.missions[id].completedAt` |
| `mission_started` | `gameProgress.missions[id].startedAt` (set on first active) |
| `planet_survey_completed` | `surveyCompletedAt` or completed survey state |
| `location_completed` | `gameProgress.locations[id].completedAt` |
| `discovery_added` | discovery journal `discoveredAt` |
| `outpost_planned` | `gameProgress.planets[id].plannedAt` |
| `system_first_visited` | `gameProgress.systems[id].exploredAt` |
| `system_fully_completed` | derived when all linked content complete |
| `knowledge_unlocked` | derived when system explored + catalogue knowledge entries |
| `universe_entered` | `milestones.enteredAt` or earliest event in universe |

### Performance
`getTimelineEventsCached()` keyed by `activeUniverseId:timelineDataVersion`; invalidated via `invalidateTimelineCache()` on save.

### Save safety
Save v2 top-level keys unchanged. Optional nested fields: `startedAt`, `exploredAt`, `plannedAt`, `surveyCompletedAt`, `milestones.enteredAt`.

## QA Summary

**Verdict: PASS** (automated)

| Script | Result |
|--------|--------|
| `qa-phase-29-check.js` | 29/29 |
| Full suite (22–29) | **193/193** |

Deferred manual QA unchanged: folder save/load E2E, pan/zoom smoke, live overlap audit.

## Known Issues

- Legacy saves lack new timestamp fields — some historical events appear only after new progress or may be omitted
- Knowledge unlock events share system `exploredAt` (not per-entry unlock tracking)
- See `docs/known-issues.md`

## Next Phase Recommendation

**Knowledge Atlas Pack 2** — continue catalogue expansion; optional timeline export (read-only JSON download, no save change).
