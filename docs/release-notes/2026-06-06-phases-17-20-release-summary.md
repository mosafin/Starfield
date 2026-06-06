# Feature Report — Discovery, Quest Atlas, NG+ Universes & Factions (Phases 17–20)
Date: 2026-06-06

## What Changed

Four feature phases plus a QA bug-fix pass:

| Phase | Summary |
|-------|---------|
| **17 — Personal Discovery Log** | Discoveries tab; journal at `locations.__discoveryJournal__`; filters, stats, Show on Map |
| **18 — Quest Progression Atlas** | Mission chains, Faction Progress, Recommended Next Missions, campaign % (Main / Faction / DLC) |
| **19 — NG+ Universe Tracker** | Save v2 envelope; 4 universe profiles; Master Atlas; Export Universe / Export Atlas |
| **20 — Faction & Territory Overlay** | Faction metadata on 120 systems; map layers; Faction Summary; details panel lines |
| **QA fixes** | Full v2 load replaces all universe slots; deduplicated border-system faction lists |

## Why It Matters

Players can log personal finds, follow quest chains across factions, track multiple NG+ playthroughs in one file, and see political territory on the map — all offline, with automatic migration from older saves.

## Files Updated

- `Starmap - Fav v3 .html` — all phase features + QA fixes
- `README.md`, `CONTEXT.md`, `memory/README.md`
- `docs/release-notes/` — per-phase reports + QA fix note + this summary
- `docs/known-issues.md`
- `scripts/qa-static-check.js`, `qa-migration-check.js`, `qa-faction-count.js`

## User-Facing Behaviour

### Discovery Log (17)
- **Discoveries** tab (6th view): add entries from system/planet/location views; search and filter by type, system, planet, date
- Journal stored inside existing `locations` save section

### Quest Progression (18)
- **Missions** tab: Faction Progress bars, Recommended Next Missions per questline, chain viewer with prerequisite warnings
- Galaxy Progress campaign tiles: Main Quest %, combined Faction %, DLC %

### NG+ Universes (19)
- **Universes** tab (7th view); **Current Universe** dropdown in header
- Four profiles; Master Atlas never resets on Fresh Map
- Legacy `{ systems, missions, planets, locations }` → Universe 1 automatically

### Faction Territories (20)
- Map layers → **Faction Territories** (6 toggles); **Faction Summary** with click-to-highlight
- System details: **Faction** and **Influence** lines (catalogue-only)

### Save behaviour (QA fix)
- Loading a **full atlas** JSON replaces all four universe slots; use **Export Universe** to merge a single profile

## Technical Notes

- Save root: `{ version: 2, activeUniverseId, universes, masterAtlas }`; runtime aliases via `bindActiveUniverse()`
- Discovery: `DISCOVERY_JOURNAL_KEY = '__discoveryJournal__'`
- Quest chains: `MISSION_CAMPAIGN_CHAINS`, `applyMissionChainMetadata()` on `missionData`
- Faction: `SYSTEM_FACTION_LISTS`, `applySystemFactionMetadata()` — not persisted
- Panel top offset **92px** for taller view switcher + universe row
- QA scripts in `scripts/` for static, migration, and faction distribution checks

## QA Summary

**Pass** (2026-06-06 re-test after bug fixes)

| Check | Result |
|-------|--------|
| Static / syntax | 26/26 |
| Save migration | 8/8 |
| Faction catalogue | 120 systems, 0 duplicate list entries |
| Browser smoke | Load, 7 tabs, faction UI, localStorage reload, partial v2 import |
| Open bugs | None |

Not re-run this cycle: pan/zoom drag, note modal, folder picker end-to-end.

## Known Issues

- Faction assignments are atlas approximations (see Phase 20 report)
- Map label **●** = mission available, not explored
- Manual QA gaps listed in `docs/known-issues.md`

## Next Phase Recommendation

1. **`disputed` / `warZone` overlays** for border systems when catalogue extended
2. Wire `scripts/qa-*.js` into a pre-release check
3. Manual smoke on pan/zoom and folder save/load before public share
