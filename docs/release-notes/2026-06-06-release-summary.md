# Feature Report — Missions, Progress & Save Release
Date: 2026-06-06

## What Changed

This release cycle delivered the full mission-tracking stack, map reset improvements, save future-proofing, and QA polish:

| Deliverable | Summary |
|-------------|---------|
| **Mission database (Phase 1.1)** | 122 read-only missions across 10 groups |
| **Mission filters** | Search title; filter by group, expansion, status; completed/active toggles |
| **Progress summary** | Total / Completed / Active / Remaining / Skipped; category %; bucket icons; legend |
| **Fresh Map** | Confirmed reset of map exploration; missions preserved |
| **Save envelope** | `{ systems, missions, planets, locations }` — last two reserved, unused |
| **QA fixes** | Zoom **Reset view** label; **Skipped** stat; `pointerup` pan release |

Also retained from earlier in cycle: zoom viewport fix (full-screen background, reset view), mission save-pollution fix, status change without full re-render.

## Why It Matters

Players get a complete offline checklist for Starfield missions with filtering and at-a-glance progress, can restart map exploration without losing quest notes, and saves are ready for future planet/location tracking without a migration break.

## Files Updated

- `Starmap - Fav v3 .html` — all application code
- `README.md` — player guide (features, controls, save format)
- `CONTEXT.md` — technical reference for agents
- `docs/known-issues.md` — current limitations
- `docs/release-notes/` — dated feature reports
- `memory/README.md` — project memory stub

## User-Facing Behaviour

### Star Systems
- Pan, zoom (25%–500%), explore, scan, note on 120 systems
- **Reset view** restores default zoom/pan; **Fresh Map** / **Reset Exploration** clear map progress after confirmation

### Missions
- 122 missions with status, notes, Show on Map
- Filter bar and progress dashboard at top of Missions tab
- Status icons: ● available · ✓ completed · ⚠ active

### Save & Load
- Auto-save to browser; JSON export includes four top-level keys
- Old flat system-only saves still load

## Technical Notes

### Save shape
```js
{
  systems: {},    // explored, scanned, note per system id
  missions: {},   // status, note, completedAt per edited mission id
  planets: {},    // reserved — preserved on import, not used in UI
  locations: {}   // reserved — preserved on import, not used in UI
}
```

### Key rules for future agents
- **`missionData`** and **`starSystemsData`** are read-only at runtime
- **`missionFilterState`** is never persisted
- **`readMissionState()`** for display; **`saveMissionState()`** only writer to `missionStates`
- Overview stats use full catalogue; bucket row counts use **filtered** missions
- **`mergeAuxiliarySaveSections()`** on load for `planets` / `locations`

### Notable functions added
`showConfirmBox`, `startFreshMap`, `confirmStartFreshMap`, `missionMatchesFilters`, `updateMissionProgressSummary`, `computeMissionOverviewStats`, `mergeAuxiliarySaveSections`, `getMissionStatusIndicator`, `getBucketStatusIndicator`

## QA Summary

**PASS** — Final automated pass: **35/35 checks** (2026-06-06).

Verified: save/migrate/merge, 122 missions, filters, stats (including Skipped sum), Fresh Map confirm, Reset view, note modal, explore/scan toggles, no mission save pollution.

**Not live-tested:** Folder picker save/load (code-reviewed; download fallback confirmed in source).

## Known Issues

See `docs/known-issues.md`:
- Folder save/load — manual Chrome test recommended
- Star map filter/search — not implemented (mission filters are)
- Pan auto-centers when zoomed out — by design
- Info panel — counters only

## Next Phase Recommendation

1. **Star map filters / search** — MapGenie-style category toggles and system name search on the map
2. **Manual folder save smoke test** — close the last QA gap
3. **Planets / locations data** — when ready, wire UI to reserved save keys without changing envelope shape
