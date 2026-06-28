# Known Issues — Starfield Starmap Explorer

Living list of limitations, deferred QA items, and optional polish. Last reviewed: 2026-06-28 (Phase 40 — v1.0.0 RC).

---

## Critical

_None at v1.0.0 RC._

---

## Medium
### Timeline lacks timestamps for legacy progress
- Phase 29 adds optional nested fields (`startedAt`, `exploredAt`, `plannedAt`, `surveyCompletedAt`, `milestones.enteredAt`) when new actions occur.
- Older saves may omit events that predate these hooks unless the underlying record already had `completedAt` / `discoveredAt`.

### Knowledge timeline events use system exploration time
- `knowledge_unlocked` events share the system's `exploredAt` — not per-entry unlock tracking.

### Planning scores are heuristics, not game rankings
- Phase 28 **Planning Score** subscores (Exploration, Resources, Knowledge, Missions, Overall) use catalogue + saved progress only.
- They help compare systems side-by-side; they do not reflect in-game difficulty tuning, vendor stock, or dynamic quest availability.

### Shattered Space pack — catalogue depth only
- Phase 38 loads validated Shattered Space missions, Lantana planets, and linked locations via `atlasPack_shatteredSpace`.
- Lantana remains on the Core star map; the pack adds catalogue depth — not new map coordinates.
- `dazra_kavnyk` is a catalogue-only Kavnyk reference (`dlc_unmapped`) without a starmap system id.
- No Shattered Space knowledge rows until validated entries exist.

### Mission Atlas metadata is partial by design
- Phase 34 adds optional mission metadata (start location, prerequisites, follow-ups, recommended level from planet data).
- **Rewards** and **choices** are empty unless explicitly catalogued — no guessed loot or branching outcomes.
- Side quests and activities may lack `primaryLocationId` when multiple POIs or ambiguous `locationName` strings apply.

- Phase 30 ships **45** validated entries (Pack 1 + ship vendors/manufacturers/services, stations, medical, trainers, district magazines, unique weapons/armour, landmarks, crew hubs).
- Individual skill magazine **issues** are not mapped — district-level magazine vendors only (MAST, Ryujin Tower, The Rock).
- Exact temple POIs and per-power unlock sites remain framework rows with null `systemId`.
- Recruitable crew beyond the Constellation hub at The Lodge are not individually catalogued until validated POIs exist.
- Entries with null `systemId` (power/temple frameworks) or null `locationId` (Barrett, Vasco, Dream Home) show **Show on Map unavailable** — by design, not broken refs.
- Vendor entries link to city/settlement POIs, not separate shop interiors in `locationData`.

### Route Planner uses straight-line atlas distances
- Jump paths are computed from catalogue `x`/`y` positions, not in-game grav-drive lane topology.
- **Direct Route** ignores intermediate systems; shortest/lowest-difficulty modes may route through any catalogue system unless blocked by avoid-tier options.
- Saved routes store the computed path at save time; reloading a route re-runs pathfinding with current options.

### Command Center recommendation heuristics are approximate
- Suggestions combine mission availability, survey %, outpost priority, faction %, and recent discoveries — not in-game quest markers.
- **Continue Playing** picks active Main Quest first, then any active mission, then the Missions tab recommendation engine.
- Resource watchlist uses catalogue `systemsByResource` indexes only (not player survey totals).

### Folder save/load — Chrome/Edge only
- **Behaviour:** Folder picker unavailable in Firefox/Safari.
- **Workaround:** Use **Export Atlas** + **Open save** (see `docs/Backup-Restore-Guide.md`).
- **Status:** Documented limitation — not a bug.

### F key requires selected system on Star Systems view
- Switching to another tab clears `selectedSystemId` when details close.
- **Workaround:** Use Galactic Search **Show on Map** or click the system on the map.

### Pan/zoom manual smoke — RC pass (Phase 39)
- Automated layout audit passes at 1280–1920px; pan/zoom spot-check recommended after local file updates.

### Note modal not re-verified (Phase 21)
- **Behaviour:** Save/cancel/icon colour flow not browser-tested this cycle.
- **Workaround:** Spot-check one system note after reload.

---

## Low

### Faction assignments are approximate
- `SYSTEM_FACTION_LISTS` reflects atlas guesses, not in-game political boundaries.
- House Va'ruun / Independent / Unknown have no faction mission questline in catalogue.
- Map label **●** on system names means **mission available**, not explored.

### Resource atlas catalogue gaps
- **Nickel** is searchable in the atlas but has **0** catalogue planet hits until `planetData` includes it.
- **Titanium** has catalogue hits but no map-layer toggle (atlas layers cover Iron, Aluminum, Copper, Water, Helium-3 only).
- Atlas lists catalogue `planetData.resources`, not player survey resource counts.

### Resource filter bar on mobile
- Filter bar stacks above search/layers at bottom of viewport on narrow screens; not browser-verified at 768px.

### Label overlap in dense regions
- Crowded clusters use small **manual marker offsets** (Phase 9 spacing polish); some overlap may remain on smaller viewports.

### Mobile layout
- System details drilldown and search bar positioning not fully QA'd on phones/tablets.

### Stale HTML after local file updates
- Opening the `.html` file directly may show an older cached version (missing ℹ buttons or locations panel). Hard refresh (**Ctrl+F5**) loads the latest build.

### Planet catalogue uses numbered stubs for procedural bodies
- Phase 32 adds numbered planet entries (`System I`, `System II`, …) for all 120 systems with `level: null` and `resources: []`.
- Named in-game bodies (Jemison, Kreet, Dazra, etc.) retain validated survey data where known; stubs are catalogue anchors — not guessed resources.

### Location catalogue covers named POIs only
- **63** validated locations — major cities, districts, quest hubs, starstations, temples, mines, labs (Phase 33). ~98 systems have planets but no named surface POI (intentional — no guessed settlements).
- **Serpentis** has no validated named POI in mission catalogue yet.

### Planet catalogue is partial
- `planetData` has **558** bodies (Phase 32 Core Atlas); all 120 systems have at least one entry.
- Numbered stub bodies use `level: null` and `resources: []` — survey data added only when validated.
- Legacy `wolf_i` coexists with named Wolf bodies (Chthonia, Etherea, Pontem).

### Location catalogue is partial
- `locationData` has **63** POIs including Neon districts, Akila landmarks, Unity/Procyon temples, and Shattered Space sites.
- One entry (`dazra_kavnyk`) references Kavnyk/Va'ruun'kai with `systemId: null` (not on starmap).
- Orbital/system POIs use `planetId: null` by design (Stroud-Eklund, Trident, UC Vigilance, Crucible, The Key, The Almagest, The Colander).
- **Two Den entries:** `the_den` (Narion) and `the_den_wolf` (Wolf/Chthonia); missions list Wolf.
- **The Well** (Volii) may disagree with some mission catalogue system fields — see POI `notes`.
- Mantis Lair, Vulture's Roost, and Tau Ceti II settlements use approximate `planetId` anchors (documented in notes).
- Map location-type **layers** highlight systems with catalogue POIs; no per-location map badges yet.

---

## Resolved (2026-06-06)

| Issue | Resolution |
|-------|------------|
| Map clicks broken after pan refactor | `setPointerCapture()` deferred until pan starts |
| Pan unusable at zoom ≤ 100% | `clampPan()` padding allows pan at all zoom levels |
| No system details panel | Phase 2B panel via ℹ button |
| No system name search on map | Phase 2A search bar |
| Unknown planet ids showed bad Roman casing (e.g. Porrima Iii) | `formatPlanetIdSegment()` in `getPlanetDisplayName()` |
| Stale planet meta after location status edit in details panel | `refreshPlanetCatalogMetaInPanel()` called from `saveLocationState()` |
| Map difficulty-tier filters missing | Phase 10 — Difficulty group in Map layers + details panel tier line |
| Location refs to missing `deimos` / `porrima_iii` | Phase 11 — planet entries added; validation clean |
| Starter-only planet/location catalogues | Phase 11 Pack 1 — 67 planets, 24 locations for 13 priority systems |
| Pack 2 atlas expansion | Phase 12 — 149 planets, 37 locations; 12 systems + Neon/Akila POIs |
| Flat planet/location details lists | Phase 13 — drilldown hierarchy with lazy expand + in-panel search |
| No planet survey tracking | Phase 14 — optional `survey` object in planet progress + map filters |
| Galaxy resource lookup missing | Phase 15 — Resources tab + indexes; **Reset filter** bar on map |
| Resource highlight stuck after reset | Phase 15 QA fix — highlight decoupled from atlas search re-render |
| No outpost planning | Phase 16 — Outposts tab + drilldown planner + Planned Outposts map layer |
| No personal discovery log | Phase 17 — Discoveries tab + `__discoveryJournal__` under locations save |
| No NG+ universe tracking | Phase 19 — save v2, four profiles, Master Atlas |
| No faction territory overlay | Phase 20 — catalogue faction + map layers + summary panel |
| Partial v2 save left stale universe slots | QA fix — `migrateSaveToUniverseFormat()` resets all slots before import |
| Border systems in multiple faction lists | QA fix — deduplicated `SYSTEM_FACTION_LISTS` (5 systems) |
| Top menu overlapped map layers / blocked clicks | Phase 21 — `#topUiChrome` grid + dynamic `--secondary-panel-top` |
| Wide save bar competed with details panel | Phase 22 — compact **More ▾** menu + sticky details header + `--bottom-ui-reserve` |
| Resource + route filter bars overlapped at same position | QA fix — `syncMapFilterBarLayout()` stacks route bar below resource bar |
| Resource + route map highlights AND-combined | QA fix — union highlight when both filters active |
| Mobile details panel ignored dynamic bottom reserve | QA fix — `@media 768px` uses `var(--bottom-ui-reserve)` |
| Zoom controls active on non-map tabs | QA fix — `.map-controls-primary` hidden when `view !== 'systems'` |
| `qa-migration-check.js` skipped routes round-trip | QA fix — v2 round-trip asserts `routes` preserved |
| Ten-tab row crowded top-left chrome | Phase 26 — primary tabs + **More ▾** for secondary views |
| Knowledge Atlas starter seed only (8 entries) | Phase 27 Pack 1 — **22** validated entries; magazine/temple detail deferred |
| No side-by-side system comparison | Phase 28 — Compare & Planning Mode (runtime, up to 4 systems) |
| No chronological adventure history | Phase 29 — Galaxy Timeline (generated from save progress) |
| Knowledge Atlas missing ship/medical/trainer detail | Phase 30 Pack 2 — **45** entries, detail panel, related links, enhanced search |
| No unified atlas validation / expansion tooling | Phase 31 — `validateAtlas()`, `getAtlasStatistics()`, `getExpansionReadiness()`, `AtlasManager` |
| Core Atlas missing planets in most systems | Phase 32 — **558** planets, **53** locations, 100% system planet coverage |
| Location atlas shallow in priority hubs | Phase 33 — **63** locations, category standardisation, location coverage stats |
| Mission tracker lacked reference metadata | Phase 34 — Mission Atlas 2.0: metadata, detail view, filters, cross-links |
| No unified RC regression runner | Phase 40 — `run-full-regression.js`, save compatibility, performance baseline |
| Stale view-tab count in phases 23–25 QA | Phase 40 — updated for 13 tabs (Fleet + Insights) |

---

## Browser

| Limitation | Browsers |
|------------|----------|
| Folder picker | Chrome, Edge only |
| Offline CDN | Tailwind / Font Awesome need network on first load unless cached |
