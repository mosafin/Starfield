# Starfield Starmap Explorer

An offline, single-file interactive galaxy map for *Starfield*. Track which star systems you've explored, scanned, and noted — plus a full mission tracker with filters and progress stats — without an account or internet connection (except CDN fonts on first load).

**Open the app:** double-click `Starmap - Fav v3 .html` in Chrome or Edge (recommended for folder saves).

---

## Features

### Star Systems view (default)
- Pan and zoom across all **120** star systems (drag works at every zoom level)
- Subtle spacing on crowded clusters so names and icons are easier to click
- **Search systems…** — live name search; matching stars glow, others fade; **Enter** jumps to the first match
- **Map layers** — collapsible panel to highlight systems by difficulty, missions, locations, faction territories, survey, resources, outposts, notes, and progress; runtime only, not saved
- **Faction territories** — catalogue-based UC / Freestar / Crimson Fleet / Va'ruun / Independent / Unknown overlays with summary panel
- **Mission badges** beside linked systems: ● missions available · ⚠ active mission · ✓ all linked missions done
- Mark systems **explored** (click the system name)
- Mark systems **scanned** (click the eye icon)
- Add **notes** per system (click the note icon, or use the details panel)
- **System details (ℹ)** — mission summary, difficulty tier, explored/scanned toggles, note, linked missions, and a **planet drilldown** (expand planets → locations → missions) with progress icons and **Show on Map**
- Progress bar: total / explored / scanned counts
- **Reset Exploration** clears all system progress (missions are kept)

### Missions view
- Switch via **Star Systems** / **Missions** / **Galaxy Progress** / **Resources** / **Outposts** / **Discoveries** / **Universes** / **Command Center** / **Route Planner** / **Knowledge Atlas** tabs (top-left)
- **Current Universe** dropdown sits directly under the tabs (same top-left zone)
- **Search systems…** sits in the top-centre (Star Systems view only)
- Zoom and save controls sit in the top-right — they no longer overlap the tabs or search bar
- **Current Universe** dropdown — switch between Universe 1–4; each keeps its own mission, planet, location, survey, outpost, and discovery progress
- **122 missions** across Main Quest, faction lines, companions, side quests, activities, Shattered Space, and Terran Armada
- **Campaign completion** — Main Quest %, combined Faction %, and DLC % (Shattered Space + Terran Armada)
- **Faction Progress** — completed count per questline (Main Quest, UC Vanguard, Freestar Rangers, Ryujin Industries, Crimson Fleet)
- **Recommended Next Missions** — suggests the next available step in each tracked campaign based on your progress
- **Quest chains** on each mission card — previous → current → next with status colouring
- **Prerequisite warning** when a mission is marked Active but earlier chain steps are incomplete
- **Progress summary:** Total / Completed / Active / Remaining / Skipped, plus completion % for Main Quest, Faction, Shattered Space, and Terran Armada
- **Status icons:** ● available · ✓ completed / all done · ⚠ active
- **Filters:** search title, group, expansion, status; “completed only” and “active only” toggles
- Track mission **status**: Not started, Active, Completed, Skipped
- Add a free-text **note** per mission (saved when you leave the field)
- **Show on Map** jumps back to the map, highlights the system, and opens its details panel (when assigned)
- **Plan Route** on mission cards (and recommended missions) opens the Route Planner with that mission’s system as the destination

### Galaxy Progress view
- Read-only snapshot: systems explored/scanned, mission totals, catalogue planet/location progress, survey-complete count
- Does not change save data

### Command Center view
- **Recommended Actions** — priority-sorted suggestions from missions, surveys, outposts, faction questlines, and recent discoveries (recomputed on each visit)
- **Continue Playing** — active Main Quest (or next recommended mission), linked system and planet, **Show on Map**
- **Exploration Opportunities** — systems closest to 100% survey completion; click or **Show on Map** opens details on the map
- **Resource Watchlist** — Helium-3, Titanium, Iron, Water with catalogue systems from existing resource indexes
- **Faction Progress Snapshot** — Main Quest + faction campaign % with link to Missions tab
- **Discovery Highlights** — most recent journal entries with map/details navigation
- **Universe Snapshot** — active universe name, blended completion %, active missions, surveyed planets, locations completed
- Dashboard is **read-only** and **not saved** — no new top-level save keys

### Route Planner view
- Pick **Start** and **Destination** systems, optional **Add Stop** waypoints for multi-leg survey or farming runs
- **Direct Route** — straight start → destination (no intermediate jumps)
- **Shortest Jump Path** — Dijkstra routing on catalogue `x`/`y` coordinates
- **Lowest Difficulty Path** — distance plus difficulty penalties; optional **Avoid Red / Tier 5**, **Prefer Main**, **Prefer Explored**
- **Route summary** — stops, estimated map distance, highest difficulty tier, explored waypoint count, full jump path preview
- **Highlight on Map** — route systems use the existing purple layer-match glow; **Reset route** bar on the map clears it
- **Route name** and **Route notes** — saved only when you click **Save Route** (stored in `gameProgress.routes` for the active universe)
- **Plan Route** from Missions tab and Galaxy Resources tab pre-fills the destination system
- Saved routes list supports **Load**, **Highlight**, and **Delete**

### Knowledge Atlas view
- Read-only **`knowledgeData`** catalogue — vendors, companions, temples, powers, magazines, player homes, unique gear, ship vendors, trainers
- Search by **title**, **type**, or **tag** (e.g. Andreja, Powers, Magazines, Vendors)
- Category filters: Vendors · Powers · Temples · Companions · Homes · Unique Items
- **Show on Map** on every entry with a linked system
- System details panel shows **Knowledge Entries: X** and a bullet list for that system
- Expanded location drilldown shows linked knowledge entries
- Starter seed only (companions, homes, The Lodge, powers framework) — not saved, no save migration

### Galaxy Resources view
- Live search across **Iron**, **Aluminum**, **Copper**, **Helium-3**, **Titanium**, **Nickel**, **Water**
- Each match shows **Systems: X · Planets: Y** and a **Found on** list grouped by star system
- **Highlight on Map** — matching systems glow; others fade (same styles as Map layers)
- **Plan Route** — opens Route Planner with the first catalogue system for that resource (per-system **Plan Route** on each “Found on” group)
- **Show on Map** on a planet row focuses that system on the map (and applies that resource highlight)
- After **Show on Map** or **Highlight on Map**, the Star Systems view shows a **Resource filter** bar with **Reset filter** to clear the highlight
- Map highlight is only applied by **Highlight on Map** or **Show on Map** — typing in the Resources search does not change the map
- Click a resource in a planet drilldown (✓ Iron, etc.) to open this tab pre-filtered (without map highlight until you use the buttons above)
- Catalogue-only — no resource progress is saved

### Outpost Planner view
- Mark catalogue planets as **Planned Outpost** from the system details drilldown
- Set **name**, **priority** (Low / Medium / High), and long-form **notes** per planet
- **Outposts** tab shows summary counts and a list of all planned sites with catalogue **resources**
- **Show on Map** on each outpost card focuses that system
- Map layer **Planned Outposts** highlights systems with at least one planned body (runtime only)
- Saved inside planet progress — no new top-level save keys

### Discovery Journal view
- **+ Discovery** in system details, expanded planet view, or expanded location view
- Record **title**, **type** (landmark, vendor, weapon, armor, ship, resource, outpost, companion, easter egg, custom), and long-form **notes**
- **Discoveries** tab — total count, breakdown by type, most documented systems, recent discoveries
- Filter by type, system, planet, and date added; live search on title and notes
- **Show on Map** on each entry focuses the linked system and opens its details panel
- Saved inside the existing `locations` save section — no new top-level save keys

### Map reset
- **Fresh Map** (top-right) clears all exploration, scan marks, and system notes after confirmation
- **Reset Exploration** (bottom bar) uses the same confirmed reset flow
- Mission progress is **not** cleared by either control
- Location progress is **not** cleared by either control
- Planet progress is **not** cleared by either control

---

## Controls

### Top-left — View switcher
| Tab | Action |
|-----|--------|
| **Star Systems** | Interactive map (default) |
| **Missions** | Mission checklist, faction progress, quest chains, recommendations |
| **Galaxy Progress** | Read-only progress summary |
| **Resources** | Galaxy-wide resource finder |
| **Outposts** | Planned outpost summary and resource hubs |
| **Discoveries** | Personal discovery journal |
| **Universes** | NG+ profiles, compare runs, master atlas, milestones |
| **Command Center** | Actionable dashboard — what to do next |
| **Route Planner** | Travel routes, multi-stop planning, saved routes |
| **Knowledge Atlas** | Read-only knowledge base — companions, vendors, homes, powers |

### Universes view (NG+ tracker)
- **Universe Completion** — Main Quest %, Faction %, Survey %, Discovery % for the active universe
- **Compare Universes** — overall mission % per profile
- **NG+ Milestones** — Unity entered, NG+ level, special universe notes (e.g. “Evil Andreja universe”)
- **Master Atlas** — lifetime systems visited, planets surveyed, locations discovered, and total discoveries across all universes (never reset)
- **Export Universe** — current profile only
- **Export Atlas** — all universes + master record

### Star Systems — Search bar
| Control | Action |
|---------|--------|
| **Search systems…** | Filter map labels by name (case-insensitive) |
| **×** | Clear search and restore all labels |
| **Enter** | Pan to first matching system |

### Star Systems — Resource filter bar
Shown after **Highlight on Map** or **Show on Map** from the Resources tab.

| Control | Action |
|---------|--------|
| **Resource filter: …** | Indicates which catalogue resource is highlighted on the map |
| **Reset filter** | Clear resource highlight and restore all system labels |

### Star Systems — Map layers
| Control | Action |
|---------|--------|
| **Map layers** | Expand/collapse the layers panel |
| Layer checkboxes | Highlight matching systems; fade others |
| **Show active missions** | Enable active-mission layer only (quick play shortcut) |
| **Clear all layers** | Turn off all layer toggles |

### Top-right — Map & save bar
Primary controls are always visible; save/export actions live in **More ▾**.

| Control | Action |
|---------|--------|
| **−** / **+** | Zoom out / in (25% steps) — Star Systems tab only |
| **100%** label | Current zoom level |
| **Reset view** | Restore 100% zoom and center the map |
| **More ▾** | Open menu: Folder, Save, Export Universe, Export Atlas, Open save…, Refresh saves, Fresh Map |

### Map interaction
| Action | How |
|--------|-----|
| Pan | Click and drag empty map space, or click-hold-drag on a system label |
| Zoom | Mouse wheel, or **+/−** buttons |
| Explore system | Click system name |
| Scan | Click eye icon |
| Note | Click note icon |
| System details | Click **ℹ** next to a system |

### System details panel (ℹ)
- **Explored / Scanned** checkboxes sync with the map
- **System note** field saves when you leave the field
- **Linked missions** — read-only list with status icons
- **Faction** and **Influence** — catalogue territory metadata (United Colonies, Freestar Collective, etc.)
- **Mission count** and **Difficulty tier** — linked missions and level tier for the system
- **Planets drilldown** — expand **▼ Planets** to browse bodies; expand a planet for **survey progress**, **outpost planning**, clickable catalogue **resources** (opens **Resources** tab), locations, and missions
- **Search planets and locations…** — filters only inside the open system panel (does not affect the galaxy search bar)
- Progress icons: **✓** completed · **⚠** in progress / visited / active · **○** not started
- **Survey Progress** — edit found/total counts per category; **Overall Survey** % updates automatically; **✓ Survey Complete** at 100%
- **Planets Surveyed: X / Y** — summary line for fully surveyed catalogue bodies in the open system
- **Outpost Planning** — checkbox, name, priority (Low / Medium / High), notes; saves when you edit
- **+ Discovery** — quick-add a personal discovery linked to this system, planet, or location
- **Show on Map** — on planets, locations, and missions; returns to the map and focuses the system
- Richest catalogue coverage in **Sol, Alpha Centauri, Narion, Cheyenne, Volii, Porrima, Kryx, Indum, Oborum Prime, Freya, Masada, Lantana, Nirvana** (Pack 1), plus expanded bodies in **Wolf, Tau Ceti, Groombridge, Jaffa, Eridani, Valo, Piazzi, Olympus, Schrodinger, Feynman, Serpentis, Bohr** (Pack 2). Other systems may show fewer or no catalogue entries.

### Map layers panel (Star Systems tab)
Collapsible **Map layers** panel near the search bar. Toggles are **not saved** — they reset on reload.

| Group | Layers |
|-------|--------|
| **Missions** | Mission systems · Systems with active missions · Completed mission systems |
| **Difficulty** | Level Tier 1–5 / Green–Red · Main / Cyan |
| **Locations** | Cities · Settlements · Starstations · Staryards · Temples · Outposts · Vendors |
| **Survey** | Has survey progress · Survey complete |
| **Resources** | Contains Iron · Aluminum · Copper · Water · Helium-3 (only if present in catalogue) |
| **Outposts** | Planned Outposts |
| **Notes** | Systems with notes |
| **Progress** | Explored · Unexplored · Scanned · Unscanned |
| **Faction Territories** | United Colonies · Freestar Collective · Crimson Fleet · House Va'ruun · Independent · Unknown |

**Faction Summary** (in the layers panel): per-faction system counts (e.g. United Colonies: 42 systems), faction mission progress where applicable, and click-to-highlight on the map.

**Faction quick filters:** Show UC · Show Freestar · Show Crimson Fleet · Show Unknown · Clear faction overlay — runtime only, not saved.

- Matching systems get a purple highlight; others fade (markers are never removed)
- Enabled location layers show compact icons under matching system labels (e.g. 🏙 City · 🛰 Station)
- **Show active missions** — one-click shortcut to highlight systems with `active` missions only
- **Show low-level systems** — tier 1, tier 2, and main systems
- **Show high-level systems** — tier 4 and tier 5 systems
- **Clear difficulty filters** — turn off difficulty tier toggles only
- **Clear all layers** — turn off every layer toggle
- Layers combine with system search and mission badges

### Keyboard shortcuts
| Key | Action |
|-----|--------|
| **+** / **=** | Zoom in |
| **−** | Zoom out |
| **0** | Reset view (zoom and pan) |

---

## Save & Load

Progress saves automatically to your browser whenever you change exploration, scan, note, mission, planet, or location data.

You can also export a `.json` file:
- **Save** / **Export Atlas** writes the full atlas: `{ version, activeUniverseId, universes, masterAtlas }`
- **Export Universe** writes a single profile (missions, planets, locations, map progress, milestones)
- Each universe stores its own `systems`, `missions`, `planets`, `locations` (including the discovery journal)
- **Master Atlas** accumulates lifetime exploration across all universes and is never cleared by Fresh Map
- Old saves `{ systems, missions, planets, locations }` migrate automatically into **Universe 1**
- Flat system-only saves still load into Universe 1
- Loading a **full atlas** JSON (Save / Export Atlas format) replaces all four universe profiles with the file contents — universes not in the file start empty
- **Export Universe** + Open save merges into one profile only (does not wipe other universes)
- **Fresh Map** / **Reset Exploration** clear system progress only; mission, planet, and location progress are not reset
- System search text and map layer toggles are not saved
- Resource atlas highlight and search are not saved

---

## Browser Compatibility

| Browser | Map & missions | Folder save/load |
|---------|----------------|------------------|
| **Chrome / Edge** | Full support | Full support |
| **Firefox / Safari** | Full support | Download/upload JSON only (no folder picker) |

Requires a modern browser with JavaScript enabled. Works from `file://` when opened locally.

---

## Tips

- Use **Reset view** (top-right) if zoom or pan feels lost — it returns to the default view.
- Use **Search systems…** to find Sol, Alpha Centauri, etc. quickly on the map.
- Use **Show active missions** in Map layers while playing to see where your active quests are.
- Use **Show on Map** from a mission to jump to its system and open details.
- Mission badges on the map update when you change status on the Missions tab.
- Hard-refresh (**Ctrl+F5**) after updating the HTML file if the map looks stale.
- When expanding planet/location catalogues, open DevTools console on load — **Starfield Catalogue Stats** reports orphans and duplicate ids (auto on localhost/`file://`, or add `?catalogueDev=1` to the URL).
