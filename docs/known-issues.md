# Known Issues — Starfield Starmap Explorer

Living list of limitations, deferred QA items, and optional polish. Last reviewed: 2026-06-06 (Phases 22–25 QA fixes).

---

## Medium

### Knowledge Atlas is a starter seed only
- Phase 25 ships **8** framework entries (4 companions, 2 homes, The Lodge, powers placeholder).
- Full Starfield population (all vendors, magazines, powers, etc.) is deferred to future catalogue packs.
- Companion/home locations are atlas approximations based on mission and location catalogues.

### Route Planner uses straight-line atlas distances
- Jump paths are computed from catalogue `x`/`y` positions, not in-game grav-drive lane topology.
- **Direct Route** ignores intermediate systems; shortest/lowest-difficulty modes may route through any catalogue system unless blocked by avoid-tier options.
- Saved routes store the computed path at save time; reloading a route re-runs pathfinding with current options.

### Command Center recommendation heuristics are approximate
- Suggestions combine mission availability, survey %, outpost priority, faction %, and recent discoveries — not in-game quest markers.
- **Continue Playing** picks active Main Quest first, then any active mission, then the Missions tab recommendation engine.
- Resource watchlist uses catalogue `systemsByResource` indexes only (not player survey totals).

### Folder save/load not verified in automated QA
- **Behaviour:** Save actions moved into **More ▾** menu; code paths unchanged (`getSavePayload()` / `applyLoadedSaveData()`).
- **Phase 22 QA:** Static + layout audit only; folder picker not exercised end-to-end.
- **Workaround:** Use Save download + Open save file picker in any browser.

### Pan/zoom manual smoke not re-run (Phase 22)
- **Behaviour:** Pan/zoom assumed stable; not re-tested after top UI chrome refactor.
- **Workaround:** Quick manual check — drag map, scroll zoom, confirm ℹ buttons still clickable after pan.

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

### Planet catalogue is partial
- `planetData` has **149** bodies (Pack 1 + Pack 2); ~95 systems still have no catalogue entries.
- Pack 2 bodies mostly use `level: null` and `resources: []` — not guessed.
- Legacy `wolf_i` coexists with named Wolf bodies (Chthonia, Etherea, Pontem).

### Location catalogue is partial
- `locationData` has **37** POIs including Neon districts, Akila landmarks, Wolf Den, and Jaffa quest sites.
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

---

## Browser

| Limitation | Browsers |
|------------|----------|
| Folder picker | Chrome, Edge only |
| Offline CDN | Tailwind / Font Awesome need network on first load unless cached |
