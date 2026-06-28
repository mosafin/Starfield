# Feature Report — Compare & Planning Mode (Phase 28)
Date: 2026-06-28

## What Changed

Added runtime **Compare & Planning Mode**: a temporary side-by-side comparison panel for up to four star systems, with resource common/unique breakdown, mission category stats, and documented planning scores. Compare entry points on System Details, Galaxy Resources, Route Planner, and Knowledge Atlas.

## Why It Matters

Players can answer “which system should I explore next?” without opening multiple detail panels — comparing difficulty, progress, resources, missions, knowledge, and outpost plans in one view.

## Files Updated

- `Starmap - Fav v3 .html` — compare state, panel UI, planning scores, integrations
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-phase-28-check.js` (new)

## User-Facing Behaviour

- **Compare** on system details adds the current system to the list (max 4, no duplicates)
- **Compare** tray appears bottom-left when the list is non-empty; click to open/close the panel
- Side-by-side columns: system name, difficulty, faction, explored/scanned, mission/planet/location counts, knowledge, resources, planned outposts, survey %
- **Mission comparison** — Main Quest, Faction Missions, Side Missions, Activities with completed % 
- **Resource comparison** (2+ systems) — per-system lists, **Common**, and **Unique to …** tags
- **Planning score** — Exploration, Resources, Knowledge, Missions, Overall (0–100)
- Quick actions: Show on Map, Open Details, Remove; **Clear All**
- **Not saved** — list clears on reload

## Technical Notes

### Planning score (`computeSystemPlanningScores`)

| Subscore | Calculation |
|----------|-------------|
| Exploration | Mean of remaining planet %, remaining location %, survey headroom (100 − survey %, or 50 if no survey data); +10 if system not explored; +5 if not scanned; cap 100 |
| Resources | `min(100, distinct catalogue resources × 14)` via `resourcesByPlanet` + `planetsBySystemId` |
| Knowledge | `min(100, knowledge entries × 18)` via `knowledgeBySystemId` |
| Missions | Remaining linked mission %; +15 if any active mission; cap 100 |
| Overall | Rounded mean of the four subscores |

Higher scores indicate a stronger planning candidate (more unfinished content / catalogue value).

### Performance

Uses existing indexes only — no duplicated catalogue arrays, no repeated full-corpus filtering per render.

### Save safety

`compareModeState` is runtime-only; `getSavePayload()` unchanged; save v2 envelope unchanged.

### Layout

Compare panel sits bottom-left with right margin for map controls; `--bottom-ui-reserve` accounts for tray/panel height; pan ignore list includes compare UI.

## QA Summary

**Verdict: PASS** (automated)

| Script | Result |
|--------|--------|
| `qa-phase-28-check.js` | 23/23 |
| `qa-static-check.js` | 51/51 |
| `qa-migration-check.js` | 16/16 |
| Full suite (Phases 22–28) | **164/164** |

Deferred manual QA unchanged: folder save/load E2E, pan/zoom smoke, live overlap audit.

## Known Issues

- Planning scores are heuristics — see `docs/known-issues.md`
- Compare list lost on page reload (by design)

## Next Phase Recommendation

**Knowledge Atlas Pack 2** — continue catalogue expansion; optional future enhancement: compare planets/locations within a system (still runtime-only).
