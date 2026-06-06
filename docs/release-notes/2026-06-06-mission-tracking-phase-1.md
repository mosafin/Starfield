# Feature Report — Mission Tracking Phase 1
Date: 2026-06-06

## What Changed
Added a **Missions** view with a starter mission list, per-mission status/notes, save integration, and **Show on Map** linking. Save format upgraded to `{ systems, missions }` with backwards-compatible migration from old flat saves.

## Why It Matters
Players can track main quest progress alongside the starmap without a second tool or spreadsheet, while keeping existing exploration/scanned/note tracking intact.

## Files Updated
- `Starmap - Fav v3 .html` — missions UI, `missionData`, `gameProgress`, save migration, view switcher
- `README.md` — created
- `CONTEXT.md` — created
- `docs/known-issues.md` — created
- `docs/release-notes/2026-06-06-mission-tracking-phase-1.md` — this file

## User-Facing Behaviour
- **Star Systems** / **Missions** tabs in the top-left; map remains default.
- Each mission card shows title, group, expansion, system, location, status dropdown, and note field.
- **Show on Map** switches to the map and highlights the linked system for ~4 seconds.
- Saves (auto, export, folder) include missions only after the player edits them.
- Old JSON saves without a `missions` key still load.

## Technical Notes
- **`gameProgress`**: `{ systems: systemStates, missions: missionStates }`
- **`readMissionState(id)`** — display-only; does not pollute saves
- **`saveMissionState(id, updates)`** — sole writer to `missionStates`; sets `completedAt` on completed
- **`normalizeSaveData` / `mergeSystemStates` / `mergeMissionStates`** — load paths
- **`updateMissionCardMeta`** — status changes update badge in place (QA fix: no full list re-render)
- **`getSavePayload()`** used by localStorage and `saveToFolder()`
- Reset Exploration clears `systemStates` only; missions preserved

## QA Summary
**Pass** — 16+ automated checks; missions, migration, merge, and map regression verified.

**Resolved during QA follow-up:**
- Mission save pollution when merely opening Missions tab
- Full list re-render on status change

## Known Issues
See `docs/known-issues.md`. Reset Exploration confirmation remains pre-existing High item.

## Next Phase Recommendation
Expand `missionData` by group (Faction, Side, Activity, Shattered Space), add group filter in Missions view, and optional pan-to-system on Show on Map.
