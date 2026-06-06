# Feature Report — Quest Dependency & Faction Progression Atlas (Phase 18)
Date: 2026-06-06

## What Changed

Extended the mission tracker with quest chain metadata, faction progression stats, campaign completion percentages, prerequisite warnings, and recommended next missions.

## Why It Matters

Players can see how far they are through UC Vanguard, Freestar Rangers, Ryujin, Crimson Fleet, and the Main Quest — what unlocks after the current mission, and what to tackle next — without leaving the atlas.

## Files Updated

- `Starmap - Fav v3 .html` — chain metadata, Missions tab UI, Galaxy Progress campaign %
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- **Faction Progress** — Completed X / Y with progress bar for Main Quest and each major faction line
- **Campaign completion** — Main Quest %, combined Faction %, DLC % (Shattered Space + Terran Armada)
- **Recommended Next Missions** — next available step per tracked campaign; active missions prioritized
- **Quest chain** on each mission card — previous → current → next with status colouring
- **Prerequisite warning** when a mission is Active but earlier chain steps are not completed/skipped
- **Show on Map** unchanged on mission cards and recommendation rows

## Technical Notes

- Chain order in `MISSION_CAMPAIGN_CHAINS`; `applyMissionChainMetadata()` sets optional fields on catalogue entries at bootstrap
- Tracks: Main Quest, UC Vanguard, Freestar Rangers, Ryujin Industries, Crimson Fleet, Shattered Space, Terran Armada
- Side quests, companion missions, and activities have no chain links
- `missionStates` save shape unchanged — relationships are read-only catalogue data

## QA Summary

Static review: save merge untouched, chain display, faction counts, DLC %, Show on Map, prerequisite logic verified.

## Known Issues

- Chain order reflects catalogue authoring, not every in-game optional branch
- Recommendations cover tracked campaigns only (not individual side quests)

## Next Phase Recommendation

Click-through from recommendation to scroll/highlight matching mission card; optional companion-quest chains.
