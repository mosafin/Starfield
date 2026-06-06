# Feature Report — QA Bug Fixes (Post Phase 20)
Date: 2026-06-06

## What Changed

Fixed two issues found during QA review of Phases 17–20:

1. **Partial v2 save import** — loading a full atlas JSON that only contained `universe_1` no longer leaves stale progress in `universe_2`–`universe_4`.
2. **Duplicate faction list entries** — five border systems appeared in multiple `SYSTEM_FACTION_LISTS` buckets; each now has a single canonical faction assignment.

## Why It Matters

Players who load a saved atlas file expect it to replace their current progress, not silently merge with old data in unused universe slots. Faction territory highlights and system details now show one consistent faction per system.

## Files Updated

- `Starmap - Fav v3 .html` — `migrateSaveToUniverseFormat()`, `SYSTEM_FACTION_LISTS`
- `scripts/qa-migration-check.js` — partial v2 import test
- `scripts/qa-static-check.js` — dynamic id check for `factionSummaryPanel`
- `docs/known-issues.md` — resolved items
- `CONTEXT.md` — save migration behaviour clarified
- `README.md` — full atlas load behaviour noted

## User-Facing Behaviour

- **Open save…** / folder load of a **full atlas** (`version: 2` with `universes`) resets all four universe profiles, then applies data from the file. Missing slots start empty.
- **Export Universe** loads still **merge** into the chosen profile only (unchanged).
- Border systems retain the same effective factions as before the dedupe (e.g. Andromas → Freestar, Lunara → Crimson Fleet).

## Technical Notes

- `migrateSaveToUniverseFormat()` — v2 branch now runs `createEmptyUniverse()` for every `UNIVERSE_IDS` slot before merging imported universes; legacy branch clears `universe_2`–`universe_4` after populating `universe_1`.
- `SYSTEM_FACTION_LISTS` — removed duplicate ids from UC/Freestar minor lists; canonical border assignments: `andromas`, `maheo`, `aranae`, `nikola` → Freestar minor; `lunara` → Crimson Fleet minor only.
- No change to `systemStates` shape or save envelope fields.

## QA Summary

**Pass** — Static 26/26, migration 8/8, browser smoke (load, faction metadata, localStorage reload, partial import in-browser). No open bugs.

## Known Issues

Deferred manual QA unchanged: pan/zoom, note modal, folder save/load file picker (see `docs/known-issues.md`).

## Next Phase Recommendation

Optional `disputed` / `warZone` catalogue fields for intentional multi-faction border systems (Phase 20 follow-up).
