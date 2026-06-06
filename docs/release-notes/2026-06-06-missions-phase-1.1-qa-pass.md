# Feature Report — Missions Phase 1.1 + Progress Enhancements (QA Pass)
Date: 2026-06-06

## What Changed
- Expanded `missionData` to **122 missions** across 10 groups
- Mission filters (search, group, expansion, status, completed/active toggles)
- Mission progress summary (stats, category %, bucket counts, status icons)
- **Fresh Map** control with real confirm dialog; Reset Exploration uses same flow
- Save envelope extended with reserved `planets` and `locations` keys

## Why It Matters
Players can track the full mission catalogue, filter and summarize progress, start a fresh exploration map without losing mission data, and future saves are ready for planet/location tracking.

## Files Updated
- `Starmap - Fav v3 .html` — all feature implementation
- `CONTEXT.md` — save envelope, missions UI reference
- `README.md` — player-facing feature list
- `docs/known-issues.md` — resolved/stale items removed

## User-Facing Behaviour
- **Missions** tab shows progress stats, filters, and 122 mission cards
- **Fresh Map** (top-right) clears map exploration after confirmation; missions unchanged
- Saves now include `{ systems, missions, planets, locations }` (last two empty until used)

## Technical Notes
- `missionFilterState` is in-memory only — never persisted
- `readMissionState()` remains read-only for list render; only `saveMissionState()` writes
- `mergeAuxiliarySaveSections()` preserves imported `planets`/`locations` data
- Category bucket counts use **filtered** missions; overview stats and % use **full** `missionData`

## QA Summary
**PASS** — 28/28 automated browser checks passed (2026-06-06). No Critical or High bugs. Folder picker path code-reviewed, not live-tested.

## Known Issues
See `docs/known-issues.md` — two “Reset” labels, map filter/search deferred, skipped missions omitted from Remaining stat breakdown.

## Next Phase Recommendation
- Map category filters / name search (MapGenie parity)
- Optional: include skipped count in overview stats or document in UI
- Rename zoom **Reset** → **Reset view**
