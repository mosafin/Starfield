# Starfield Starmap Explorer — Technical Reference

Single-file app: `Starmap - Fav v3 .html`. All CSS and JS inline. No build step.

---

## DOM Structure (map)

```
#starmapViewport          — fixed full-screen layer; #0d1117 background; pan/zoom events
  .starmap-container      — transformed layer (translate + scale); map points live here
#systemSearchBar          — live system name search (Star Systems tab only)
#mapLayersPanel           — collapsible map layer toggles (Star Systems tab only; not saved)
#systemDetailsPanel       — per-system details: missions, planets, explored/scanned/note
#missionsPanel            — filters, progress summary, scrollable mission list
  #missionProgressSummary — stats, category %, bucket icons, legend
  #missionFilters         — search / group / expansion / status filters
  #missionsList           — mission cards
#viewSwitcher             — Star Systems / Missions / … / Command Center tabs
#mapControls              — zoom, save, folder controls
#infoPanel                — progress counters + Reset Exploration
#noteModalOverlay         — shared note modal for systems
```

Pan/zoom transforms apply to `.starmap-container` only. The viewport never scales, so the space background stays full-screen.

Each `.mappoint` contains: `.system-link` (icon + name + `.system-mission-badge`), `.system-layer-indicators`, `.note-icon`, `.scan-icon`, `.system-details-btn`.

---

## Static Data

### `starSystemsData[]`
Read-only catalogue (**120 entries**). Shape:
```js
{
  id, name, x, y, point,           // x/y = % of container; point = 1–5 or 'main'
  faction,                          // optional — Phase 20: UC | Freestar | Crimson Fleet | House Va'ruun | Independent | Unknown
  influence,                        // optional — 'major' | 'minor'
  // warZone, disputed               // reserved for future overlays (catalogue-only)
}
```
Assignments from `SYSTEM_FACTION_LISTS` via `applySystemFactionMetadata()` at bootstrap. Not saved.

Rendered positions anchor at canonical `x`/`y`. Crowded systems apply small pixel offsets via `manualLabelOffsets` on the inner `.system-marker` wrapper (not saved). Highlight classes (`.search-match`, `.layer-match`, etc.) stay on `.mappoint` and glow the marker.

### Catalogue indexes (Phase 9)
Built once at load by `buildCatalogueIndexes()` after `starSystemsData` is defined:

| Index | Lookup |
|-------|--------|
| `planetById[id]` | Single planet entry |
| `locationById[id]` | Single location entry |
| `planetsBySystemId[systemId]` | Planet array for system |
| `locationsBySystemId[systemId]` | Location array for system |
| `locationsByPlanetId[planetId]` | Location array for planet |
| `locationsByType[type]` | All locations of a type |
| `systemLocationIndex[systemId].byType` | Type counts for map layers |
| `resourcesByPlanet[planetId]` | Resource name array for planet (Phase 15) |
| `planetsByResource[resourceName]` | Planet entries `{ planetId, systemId, planetName, systemName }` |
| `systemsByResource[resourceName]` | Sorted system id array containing resource |

Panel helpers (`getPlanetsForSystem`, `getLocationsForSystem`, etc.) read indexes — no per-render `filter()` scans.

Dev-only validation: `validatePlanetData()`, `validateLocationData()`, `logCatalogueHealthReport()`. Active on `localhost`, `127.0.0.1`, `file://`, or `?catalogueDev=1`. Disabled with `?catalogueDev=0`. Phase 12: 149 planets, 37 locations, 0 validation issues.

### `missionData[]`
Read-only catalogue (**122 entries**). Shape:
```js
{
  id: string,
  title: string,
  group: string,
  expansion: string,
  systemId: string|null,
  locationName: string,
  // optional — Phase 18 quest progression (set at bootstrap via applyMissionChainMetadata)
  previousMissionId: string|null,
  nextMissionId: string|null,
  faction: string|null,      // UC Vanguard, Freestar Rangers, etc.
  campaign: string|null      // Main Quest, faction name, Shattered Space, Terran Armada
}
```
Chain order is defined in `MISSION_CAMPAIGN_CHAINS`; side quests and activities have no chain links.

### `planetData[]`
Read-only catalogue (**149 entries**, Phase 12 Expansion Pack 2). Shape:
```js
{
  id: string,
  name: string,
  systemId: string,
  type: 'planet' | 'moon',
  level: number|null,
  resources: string[]
}
```
Priority systems expanded in Pack 1: Sol, Alpha Centauri, Narion, Cheyenne, Volii, Porrima, Kryx, Indum, Oborum Prime, Freya, Masada, Lantana, Nirvana. Pack 2: Wolf, Tau Ceti, Groombridge, Jaffa, Eridani, Valo, Piazzi, Olympus, Schrodinger, Feynman, Serpentis, Bohr. Unknown levels use `null`; unknown resources use `[]`.
Not written to `gameProgress.planets` at runtime except via `savePlanetState()`.

### `planetStates` (alias `gameProgress.planets`)
Only planets the player has edited are stored. Shape per planet id:
```js
{
  'jemison': {
    status: 'not_started' | 'visited' | 'surveyed' | 'completed' | 'skipped',
    note: '',
    completedAt: '',   // ISO string when status set to completed
    survey: {          // optional — created only when player edits survey fields (Phase 14)
      floraFound: 0, floraTotal: 0,
      faunaFound: 0, faunaTotal: 0,
      resourcesFound: 0, resourcesTotal: 0,
      traitsFound: 0, traitsTotal: 0
    },
    plannedOutpost: false,   // optional — Phase 16 outpost planner (created on first edit)
    outpostName: '',
    priority: 'low' | 'medium' | 'high',
    notes: ''                // outpost planning notes (separate from planet `note`)
  }
}
```
Survey completion: `round((floraFound + faunaFound + resourcesFound + traitsFound) / (floraTotal + faunaTotal + resourcesTotal + traitsTotal) * 100)` when denominator > 0. Not written until `savePlanetSurvey()` is called.

Outpost fields are written only via `savePlanetOutpostPlan()` on first edit. `notes` is the outpost planner field; planet `note` remains the general progress note.

Discovery journal at `gameProgress.locations.__discoveryJournal__`:
```js
{
  entries: [{
    id, title, type, linkedSystemId, linkedPlanetId, linkedLocationId,
    note, discoveredAt
  }]
}
```
Written only when the player saves a discovery. Location progress helpers skip `__discoveryJournal__`.

### `locationData[]`
Read-only POI catalogue (**37 entries**, Phase 12 Expansion Pack 2). Shape:
```js
{
  id: string,
  name: string,
  type: 'city' | 'settlement' | 'starstation' | 'staryard' | 'outpost'
       | 'landmark' | 'temple' | 'vendor' | 'mission_location' | 'other',
  systemId: string|null,
  planetId: string|null,
  relatedMissionIds: string[],
  tags: string[],
  notes: string
}
```
Not written to `gameProgress.locations` at runtime except via `saveLocationState()`. Entries with `systemId: null` are catalogue-only references (e.g. unmapped DLC systems) and do not appear in any system panel. Orbital POIs may use `planetId: null` intentionally (Stroud-Eklund, Trident, UC Vigilance, Crucible, The Key, The Almagest, The Colander). Wolf `the_den_wolf` and Narion `the_den` are both catalogued (mission/system mismatch documented in notes).

### `locationStates` (alias `gameProgress.locations`)
Only locations the player has edited are stored. Shape per location id:
```js
{
  'new_atlantis': {
    status: 'not_started' | 'visited' | 'completed' | 'skipped',
    note: '',
    completedAt: ''   // ISO string when status set to completed
  }
}
```

---

## Runtime State

### `gameProgress` (active universe)
Pointer to the currently selected universe inside `saveRoot.universes[activeUniverseId]`:
```js
{
  name: 'Universe 1',
  systems: {},   // alias: systemStates
  missions: {},  // alias: missionStates
  planets: {},   // alias: planetStates
  locations: {}, // alias: locationStates (includes __discoveryJournal__)
  milestones: { unityEntered: false, ngPlusLevel: 0, notes: '' }
}
```

### `saveRoot` (persisted envelope — Phase 19)
```js
{
  version: 2,
  activeUniverseId: 'universe_1',
  universes: {
    universe_1: { name, systems, missions, planets, locations, milestones },
    universe_2: { … },
    universe_3: { … },
    universe_4: { … }
  },
  masterAtlas: {
    systemsVisited: {},      // systemId → { firstExploredAt, scanned? }
    planetsSurveyed: {},     // planetId → { at }
    locationsDiscovered: {}, // locationId → { at }
    discoveryIds: {},        // union of journal entry ids
    totalDiscoveries: 0
  }
}
```
Runtime aliases (`systemStates`, `missionStates`, …) rebind on `bindActiveUniverse()`.

### `systemStates` (alias `gameProgress.systems`)
Per-system player state:
```js
{
  'narion': { explored: false, scanned: false, note: '' }
}
```

### `missionStates` (alias `gameProgress.missions`)
Only missions the player has edited are stored. Shape per mission id:
```js
{
  'one_small_step': {
    status: 'not_started' | 'active' | 'completed' | 'skipped',
    note: '',
    completedAt: ''   // ISO string when status set to completed
  }
}
```

### View / UI state (not saved)
- `currentView`: `'systems' | 'missions' | 'progress' | 'resources' | 'outposts' | 'discoveries' | 'universes'`
- `selectedSystemId` — open system details panel
- `missionFilterState` — mission list filters
- `mapLayerState` — map layer checkbox flags (Phase 8; runtime only)
- `suppressMapClick` — blocks click after drag gesture
- Pan/zoom vars (`scale`, `panX`, `panY`, `panPointerId`, …) inside `window.onload` closure

---

## Save System

### localStorage
- Key: `starfieldStarmapStates`
- Value: `JSON.stringify(getSavePayload())` → full `saveRoot` (version 2)

### Migration
- `isOldSystemStatesFormat(data)` — flat `{ systemId: { explored, scanned, note } }` saves
- `normalizeLegacyEnvelope(data)` — wraps legacy saves as `{ systems, missions, planets, locations }`
- `migrateSaveToUniverseFormat(data)` — legacy → Universe 1 + empty 2–4 + `masterAtlas`; full v2 save **replaces** all four universe slots (empty defaults, then merge file data — missing slots stay empty)
- `loadSystemStates()` merges/migrates then re-saves to upgrade localStorage on boot
- Legacy `{ systems, missions, planets, locations }` imports merge into the **active** universe only
- `exportType: 'universe'` imports merge into target universe id

### Merge on load
- `mergeSystemStates(loaded)` — key-by-key merge; does not wipe unlisted systems
- `mergeMissionStates(loaded)` — key-by-key merge with defaults
- `mergePlanetStates(loaded)` — key-by-key merge with defaults (Phase 7)
- `mergeLocationStates(loaded)` — key-by-key merge with defaults (Phase 6)
- `applyLoadedSaveData(data)` — used by folder/file import; calls `renderStarmap()` and optionally `renderMissionsList()` / details panel refresh

### Folder / file export
- `saveToFolder()` — full atlas via `getSavePayload()`
- `exportCurrentUniverse()` — single universe JSON (`exportType: 'universe'`)
- `exportFullAtlas()` — same as full save payload
- IndexedDB store `starmapSaveFolder` persists `FileSystemDirectoryHandle`
- Fallback: `<a download>` blob when folder API unavailable

### Rules
- Call `saveSystemStates()` after every mutation to `systemStates`, `missionStates`, `planetStates`, or `locationStates`
- Never mutate `starSystemsData`, `missionData`, `planetData`, or `locationData` at runtime
- Use `readMissionState()` / `readPlanetState()` / `readLocationState()` for display; only matching `save*State()` writes progress
- Planet/location edits update the details panel in place — do not call `renderStarmap()` for those changes
- Mission badges, planet catalogue, and system search are unaffected by location progress

---

## Key Functions

| Function | Purpose |
|----------|---------|
| **System search (2A)** | |
| `getSystemSearchQuery()` | Current search input value (trimmed, lowercased) |
| `systemNameMatchesSearch(system, query)` | Case-insensitive substring match on system name (query lowercased defensively) |
| `applySystemSearchHighlight()` | Delegates to `applyAllMapPointVisualStates()` |
| `clearSystemSearch()` | Clear input and restore all markers |
| `focusFirstSystemSearchResult()` | `.search-focus` + `panToSystemFn` on Enter |
| `initSystemSearch()` | Bind search bar events (once) |
| **Map layers (Phase 10)** | |
| `mapLayerState` | Runtime `{ layerId: boolean }` — not persisted |
| `MAP_LAYER_DIFFICULTY_IDS` | `difficulty_1` … `difficulty_5`, `difficulty_main` |
| `getSystemDifficultyPoint(id)` / `formatSystemDifficultyTier(system)` | Tier lookup and details-panel label |
| `systemLocationIndex` | Precomputed `{ systemId: { byType: { type: count } } }` from `locationData` |
| `systemMatchesLayer(id, layerId)` | True if system matches one layer criterion (missions, difficulty, locations, factions, progress, notes) |
| `showLowLevelDifficultyLayers()` / `showHighLevelDifficultyLayers()` / `clearDifficultyMapLayers()` | Difficulty quick actions |
| `applyMapPointVisualState(el)` | Class-only update: search + layer match/fade + location indicators |
| `applyAllMapPointVisualStates()` | Update every `.mappoint` without re-render |
| `initMapLayersPanel()` | Build layer checkboxes + quick actions (once) |
| **UI layout (Phase 21)** | |
| `#topUiChrome` | Fixed header grid: tabs/universe · search · zoom/save |
| `syncTopUiLayout()` / `initTopUiLayout()` | Measure header height → set `--secondary-panel-top` for panels below |
| `syncMapFilterBarLayout()` | Offset `#routeFilterBar` below `#resourceFilterBar` when both visible |
| `closeMapControlsMoreMenu()` / `initMapControlsMoreMenu()` | Compact save/export **More ▾** dropdown |
| `getUILayoutReport()` | Dev-only console audit of fixed UI overlap (localhost / `?uiDev=1`) |
| **Faction overlay (Phase 20–21)** | |
| `clearFactionOverlay()` | Turn off all faction layer toggles + refresh map fade |
| `highlightFactionTerritory(faction)` | Single-select faction layer + summary refresh |
| `renderFactionSummaryPanel()` | Per-faction system counts + mission progress rows |
| `getLocationTypeCountsForSystem(id)` | Cities / stations / temples / outposts counts for details panel |
| `updateSystemDetailsLocationTypeSummary(id)` | `Cities: X · Stations: X · …` line |
| **System details (2B)** | |
| `openSystemDetailsPanel(id)` / `closeSystemDetailsPanel()` | Panel visibility + `selectedSystemId` |
| `renderSystemDetailsPanel(id)` | Fill name, difficulty tier, mission line, controls, missions, drilldown tree |
| `getLinkedMissionsForSystem(id)` | Filter `missionData` by `systemId` |
| `getSystemMissionProgressText(id)` | `Mission count: X / Y completed` |
| `saveSystemNote(id, note)` | Blur-only save; skips empty no-op |
| `initSystemDetailsPanel()` | Checkbox + note blur handlers |
| **Mission badges (2C)** | |
| `getSystemMissionBadgeIndicator(id)` | ● / ⚠ / ✓ / null from linked mission states |
| `applySystemMissionBadge(el, id)` | Update `.system-mission-badge` DOM |
| `syncSystemMissionBadge(id)` | Update badge for one system on map |
| **Planets (3A/7/9)** | |
| `planetById` / `locationById` / `missionById` | O(1) catalogue entry lookup |
| `planetsBySystemId` / `locationsBySystemId` / `locationsByPlanetId` | Prebuilt arrays for panel rendering |
| `buildCatalogueIndexes()` | Populate all catalogue indexes + `systemLocationIndex` |
| `validatePlanetData()` / `validateLocationData()` | Dev-mode catalogue integrity checks |
| `getCatalogueHealthReport()` / `logCatalogueHealthReport()` | Console stats summary |
| `getPlanetsForSystem(id)` / `getPlanetCountForSystem(id)` | Index-backed planet lists |
| `readPlanetState(id)` / `savePlanetState(id, updates)` | Planet progress read/write |
| `readPlanetSurvey(id)` / `savePlanetSurvey(id, updates)` | Optional survey counters; creates `survey` on first edit |
| `calculateSurveyPercent(survey)` / `isSurveyComplete(survey)` | Sum of found ÷ sum of totals × 100 |
| `getPlanetProgressSummaryForSystem(id)` | Completed / visited counts |
| `countSurveyedPlanetsForSystem(id)` | 100% survey bodies for **Planets Surveyed** line |
| `updateSystemDetailsPlanetProgress(id)` | Refresh progress lines in details panel |
| `formatPlanetCatalogMeta(planet)` | Type, level, resources, linked location summary |
| `renderSystemDetailsDrilldown(id)` | Lazy planet → location → mission tree for selected system only |
| `applyDrilldownSearchFilter(id)` | In-panel search; auto-expands matching branches |
| `getDrilldownPlanetIndicator` / `getDrilldownLocationIndicator` / `getDrilldownMissionIndicator` | ✓ / ⚠ / ○ progress icons |
| `showSystemOnMap(id)` | Switch to map, pan, highlight, open details panel |
| **Resource atlas (15)** | |
| `RESOURCE_ATLAS_SEARCHABLE` | Fixed search list (Iron … Water) |
| `RESOURCE_CATEGORIES` | Future category map (Metals, Gases, …) — structure only |
| `getMatchingAtlasResources(query)` | Filter searchable resources |
| `getResourceAtlasStats(name)` | `{ systemCount, planetCount }` from indexes |
| `getResourceResultsGrouped(name)` | Systems with planet rows for atlas UI |
| `setResourceAtlasHighlight(name)` | Runtime map highlight via `.layer-match` / `.layer-faded` |
| `openResourceAtlas(name)` | Resources tab + search + highlight |
| `renderResourceAtlasPanel()` / `initResourceAtlas()` | Atlas UI |
| `renderGalaxyProgressPanel()` | Read-only galaxy summary tab |
| **Outpost planner (16)** | |
| `readPlanetOutpostPlan(id)` / `savePlanetOutpostPlan(id, updates)` | Outpost plan read/write on `gameProgress.planets[id]` |
| `getPlannedOutpostEntries()` / `computeOutpostSummaryStats()` | Galaxy outpost list + summary counts |
| `renderOutpostsPanel()` | **Outposts** tab UI |
| `systemHasPlannedOutpost(systemId)` | Map layer + highlight helper |
| `buildPlanetOutpostBlock(planet)` | Drilldown outpost planning panel |
| **Discovery journal (17)** | |
| `DISCOVERY_JOURNAL_KEY` | `'__discoveryJournal__'` under `gameProgress.locations` |
| `readDiscoveryEntries()` / `addDiscoveryRecord()` | Journal read/write |
| `mergeDiscoveryJournal()` | Import merge by entry id |
| `getFilteredDiscoveryEntries()` / `computeDiscoveryStats()` | Journal filters and stats |
| `renderDiscoveriesPanel()` / `openDiscoveryModal()` | Discoveries tab + quick-add modal |
| **Locations (5/6/13)** | |
| `getLocationsForSystem(id)` / `getLocationsForPlanet(planetId)` | Index-backed location lists |
| `getMissionsForLocation(location)` | Resolve `relatedMissionIds` via `missionById` |
| `getLocationCountForSystem(id)` / `getLocationCountForPlanet(planetId)` | Count helpers |
| `getLocationsByType(type)` | Index-backed global type list |
| `readLocationState(id)` / `saveLocationState(id, updates)` | Location progress read/write; refreshes location progress + linked planet meta in panel |
| `getLocationProgressSummaryForSystem(id)` / `getLocationProgressSummaryForPlanet(planetId)` | Completed / visited counts |
| `updateSystemDetailsLocationProgress(id)` | Refresh progress lines in details panel |
| `refreshPlanetCatalogMetaInPanel(planetId)` | In-place update of planet meta after location edit (QA fix) |
| `getPlanetDisplayName(planetId)` | Resolve name from `planetData`; fallback with Roman numerals |
| `formatLocationMeta(location)` | Type + planet + linked mission count line |
| **Missions** | |
| `readMissionState(id)` / `saveMissionState(id, updates)` | Mission state read/write; badge sync on status change |
| `MISSION_CAMPAIGN_CHAINS` / `applyMissionChainMetadata()` | Bootstrap chain links on catalogue `missionData` |
| `computeCampaignProgress()` / `renderFactionProgressSection()` | Faction Progress rows on Missions tab |
| `getRecommendedNextMissions()` / `renderRecommendedMissionsSection()` | Next-step suggestions |
| `buildMissionChainHtml()` / `getIncompletePrerequisites()` | Chain viewer + prerequisite warnings on cards |
| `computeDlcCompletionPercent()` | Shattered Space + Terran Armada combined % |
| `renderMissionsList()` | Filtered mission cards + summary |
| **Universe tracker (19)** | |
| `saveRoot` / `bindActiveUniverse()` / `switchUniverse()` | Multi-profile save + active alias rebind |
| `migrateSaveToUniverseFormat()` / `normalizeLegacyEnvelope()` | v1 → v2 migration |
| `updateMasterAtlasFromUniverseData()` / `rebuildMasterAtlasFromAllUniverses()` | Master Atlas accumulation |
| `renderUniversesPanel()` / `computeUniverse*Percent()` | Universes tab dashboard + compare |
| `exportCurrentUniverse()` / `exportFullAtlas()` | Split export |
| **Faction overlay (20)** | |
| `SYSTEM_FACTION_LISTS` / `applySystemFactionMetadata()` | Bootstrap faction on catalogue systems |
| `countSystemsByFaction()` / `getFactionMissionProgress()` | Summary panel stats |
| `highlightFactionTerritory()` / `renderFactionSummaryPanel()` | Click-to-highlight + summary UI |
| `getSystemFactionMeta()` / `formatFactionLabel()` | Details panel + layer matching |
| `getMissionStatusIndicator()` / `getBucketStatusIndicator()` | Per-mission and bucket icons |
| **Map render** | |
| `manualLabelOffsets` | Small pixel offsets for 21 crowded systems (marker only) |
| `resolveLabelOffsetPixels(systemId)` | Manual offset lookup |
| `getGalaxyLayoutReport()` / `logGalaxyLayoutReport()` | Dev-only spacing diagnostics |
| `renderStarmap()` | Anchor at x/y; `.system-marker` holds label/icons + offset |
| `toggleExplored` / `toggleScanned` | System progress toggles |
| `showSystemOnMap(id)` | Switch to map, highlight, open details panel |
| **Save / reset** | |
| `getSavePayload()` / `saveSystemStates()` / `loadSystemStates()` | Persist envelope |
| `startFreshMap()` / `confirmStartFreshMap()` | Clear systems with confirm |
| **Pan / zoom** | |
| `clampPan()` | Bounds with `PAN_EDGE_PADDING` (240px) at all scales |
| `startPan()` / `endPan()` / `panByDelta()` | Pointer-based drag |
| `panToSystemFn(id)` | Center viewport on system (set in onload) |
| `resetZoom()` | scale=1, panX=panY=0 |

---

## UI Layout (Phase 21)

CSS variables on `:root`:

| Variable | Purpose |
|----------|---------|
| `--ui-gap` | 12px padding between chrome and panels |
| `--top-bar-height` | Reference row height (48px) |
| `--secondary-panel-top` | Dynamic top offset for map layers, details, view panels |
| `--left-panel-top` / `--right-panel-top` | Aliased to secondary top |
| `--top-chrome-height` | Measured `#topUiChrome` height |
| `--bottom-ui-reserve` | Space reserved above bottom info panel for details max-height |

- `#topUiChrome` — fixed `z-index: 120`; children use `pointer-events: auto`
- `#starmapViewport` — `z-index: 1` so fixed UI stays above the map layer
- Map controls: primary zoom row (hidden off Star Systems tab) + **More ▾** menu (`z-index: 130` dropdown)
- Map layers / system details / side panels use `top: var(--secondary-panel-top)`
- Map filter bars: `#resourceFilterBar` at `--secondary-panel-top`; `#routeFilterBar` stacks below via `--route-filter-bar-top-offset` (`syncMapFilterBarLayout()`)
- System details: `z-index: 115`, sticky header, `max-height` uses `--bottom-ui-reserve`
- `ResizeObserver` on header + info panel recalculates offsets on wrap/resize
- Search centre column hidden on non–Star Systems views
- Dev: `getUILayoutReport()` on `window` when `UI_DEV_MODE` (localhost, file, or `?uiDev=1`)

---

## Pan / Zoom

- Bounds: `minScale = 0.25`, `maxScale = 5`
- Transform: `translate(panX, panY) scale(scale)` on `.starmap-container`, origin `0 0`
- Pointer events on `#starmapViewport`; `document` `pointermove` / `pointerup`
- `setPointerCapture()` only when pan starts — **not** on label click (preserves explore/details clicks)
- `PAN_DRAG_THRESHOLD = 6` — label click-hold must move 6px before pan steals gesture
- `suppressMapClick` — cleared on new pointer down; set after drag to block accidental click
- `clampPan()`: padded bounds allow pan at zoom ≤ 100%; clamp edges when zoomed in
- `.starmap-container.is-panning` disables transform transition during drag
- Two-finger pinch zoom via touch handlers (unchanged)
- Reset view: `#resetZoomBtn` or key **0**

---

## System Search

- Search state lives in `#systemSearchInput` only — not saved
- Classes on `.mappoint`: `.search-match`, `.search-faded`, `.search-focus`
- Re-applied after `renderStarmap()` via `applyAllMapPointVisualStates()`
- Hidden on Missions tab via `setView()`

---

## Map Layers (Phase 8)

- Panel: `#mapLayersPanel` / `#mapLayersBody` — built by `initMapLayersPanel()`
- State: `mapLayerState` — **not saved**; panel expand/collapse also runtime-only
- Layer ids: `mission_systems`, …, `survey_progress`, `survey_complete`, `resource_iron` … `resource_helium_3` (catalogue-gated), `planned_outposts`, `has_notes`, `explored`, …
- Active layers combine with **OR** logic — system matches if it satisfies any enabled layer
- Classes on `.mappoint`: `.layer-match`, `.layer-faded` (additive with search classes)
- Location-type layers show `.system-layer-indicators` text under the label when that system has matching POIs
- Quick action **Show active missions** sets only `mission_active` via `toggleActiveMissionQuickLayer()`
- Updates use class toggles only — no `renderStarmap()` on layer change
- `saveMissionState`, `toggleExplored`, `toggleScanned`, `saveSystemNote` call `applyMapPointVisualStateForSystem()` when layer-relevant state changes
- Hidden on non–Star Systems tabs via `setView()`; ignored for pan start via `shouldIgnorePanStart()`

---

## Resource Atlas (Phase 15)

- Tab: **Resources** — `#resourcesAtlasPanel` / `#resourceAtlasSearchInput` / `#resourceAtlasResults`
- Indexes built in `buildCatalogueIndexes()` — not saved
- Search state: `resourceAtlasState` + `resourceAtlasHighlightResource` — **not saved**
- Map highlight is set only by **Highlight on Map** / **Show on Map** (`setResourceAtlasHighlight()`), not by atlas search re-renders
- **Reset filter** (`#resourceFilterResetBtn`) clears highlight via `clearResourceAtlasHighlight()`; persists across tab switches
- Filter bar: `#resourceFilterBar` — visible on Star Systems tab when `resourceAtlasHighlightResource` is set
- Highlight reuses `.layer-match` / `.layer-faded` in `applyMapPointVisualState()` (AND-combined with active map layers; resource + route highlights use **union** when both are active)
- Planet drilldown resource links call `openResourceAtlas(resourceName)`
- **Galaxy Progress** tab: `renderGalaxyProgressPanel()` — systems / missions / planet / location counts only

---

## Outpost Planner (Phase 16)

- Tab: **Outposts** — `#outpostsPanel` / `#outpostsSummary` / `#outpostsList`
- Planet drilldown: `#planet-outpost-block` fields saved via `savePlanetOutpostPlan()`
- Fields on `gameProgress.planets[id]`: `plannedOutpost`, `outpostName`, `priority`, `notes` — created on first edit only
- Map layer: `planned_outposts` in group **Outposts** — `systemHasPlannedOutpost()` via existing `.layer-match` / `.layer-faded`
- Resource coverage in outpost list from catalogue `planet.resources` (read-only)
- Export/import: flat fields merge via `mergePlanetStates()` spread; no new top-level save keys

---

## Discovery Journal (Phase 17)

- Tab: **Discoveries** — `#discoveriesPanel` with search, filters, stats, entry list
- Store: `gameProgress.locations.__discoveryJournal__.entries[]` — not a catalogue location
- Types: `landmark`, `vendor`, `weapon`, `armor`, `ship`, `resource`, `outpost`, `companion`, `easter_egg`, `custom`
- Quick-add: **+ Discovery** on system details, planet drilldown, location drilldown → modal
- **Show on Map** uses `showSystemOnMap(linkedSystemId)` — no new map layers
- `readLocationState` / `saveLocationState` / `mergeLocationStates` skip `DISCOVERY_JOURNAL_KEY`

---

## Quest Progression Atlas (Phase 18)

- **Catalogue-only** chain metadata: `previousMissionId`, `nextMissionId`, `faction`, `campaign` on `missionData` (via `applyMissionChainMetadata()` at load)
- **Missions tab:** Faction Progress (Completed X / Y per campaign), Recommended Next Missions, campaign % row (Main Quest / Faction / DLC)
- **Mission cards:** vertical quest chain (prev ↓ current ↓ next); prerequisite warning when status is Active but chain predecessors incomplete
- **Galaxy Progress tab:** same Main / Faction / DLC % under mission stats
- **Show on Map** unchanged on mission cards and recommendations
- No changes to `missionStates` save shape or merge logic

---

## NG+ Universe Tracker (Phase 19)

- Four profiles: `universe_1` … `universe_4` with independent progress per universe
- **Current Universe** dropdown in view switcher — `switchUniverse()` rebinds aliases and refreshes all views
- **Universes** tab: completion dashboard, compare list, NG+ milestones, master atlas stats
- **Master Atlas** updated on every `saveSystemStates()` — cumulative, never reset by Fresh Map
- Export: `exportCurrentUniverse()` / `exportFullAtlas()`; Save button writes full atlas

---

## Atlas Command Center (Phase 23)

- Tab: **Command Center** — `#commandCenterPanel` / `#commandCenterContent` / `#viewCommandBtn`
- View id: `command` in `setView()` — full-screen panel like other atlas tabs; map hidden
- **Not saved** — runtime dashboard only; `COMMAND_CENTER_WATCHLIST` is a fixed in-memory list (Helium-3, Titanium, Iron, Water)
- Recommendation engine: `getCommandCenterRecommendations()` aggregates existing mission, survey, outpost, faction, and discovery state
- Continue playing: `getContinuePlayingSnapshot()` — prefers active Main Quest, then any active mission, then `getRecommendedNextMissions(1)`
- Survey ranking: `computeSystemSurveyPercent()` / `getSystemsClosestToSurveyCompletion()` — weighted found/total across catalogue planets with survey data
- Universe snapshot: `computeUniverseDashboardCompletion()` — average of Main Quest, Faction, Survey, Discovery % for active universe
- Quick navigation: `appendCommandCenterActions()` wraps `showSystemOnMap()` / `openSystemDetailsPanel()` / tab switches
- Refreshes via `refreshCommandCenterIfVisible()` on mission/planet/survey/outpost/discovery/universe changes when tab is active

---

## Route Planner & Travel Assistant (Phase 24)

- Tab: **Route Planner** — `#routePlannerPanel` / `#routePlannerContent` / `#viewRouteBtn`; view id `routes`
- Runtime state: `routePlannerState` (start, stops, destination, mode, options, draft name/notes, computed path) — **not saved** until user clicks **Save Route**
- Saved routes: `gameProgress.routes[id]` per universe — `{ id, name, notes, stops[], routingMode, options, pathSystemIds[], savedAt }`
- `ensureUniverseStructure()` adds empty `routes: {}` for backward compatibility
- Pathfinding: `getSystemMapDistance()` on catalogue `%` coords; `dijkstraRouteSegment()` for shortest / lowest-difficulty modes
- Map highlight: `routePlannerHighlightIds` Set + `#routeFilterBar` — stacks below resource filter bar; reuses `.layer-match` / `.layer-faded` in `applyMapPointVisualState()` (union with resource highlight when both active)
- Entry points: `openRoutePlanner()`, `openRoutePlannerForMission()`, `openRoutePlannerForResourceSystem()`
- Mission / resource **Plan Route** buttons pre-set destination system

---

## Knowledge Atlas Framework (Phase 25)

- Tab: **Knowledge Atlas** — `#knowledgeAtlasPanel` / `#knowledgeList` / `#viewKnowledgeBtn`; view id `knowledge`
- Read-only catalogue: `knowledgeData[]` — `{ id, type, title, systemId, planetId, locationId, description, tags }`
- Types: `vendor`, `companion`, `temple`, `power`, `magazine`, `player_home`, `unique_weapon`, `unique_armor`, `ship_vendor`, `trainer`
- Indexes in `buildCatalogueIndexes()`: `knowledgeById`, `knowledgeBySystemId`, `knowledgeByPlanetId`, `knowledgeByLocationId`, `knowledgeByType`
- Filters: `knowledgeFilterState` — search, category (`KNOWLEDGE_FILTER_CATEGORIES`), type
- System panel: `#systemDetailsKnowledge` count + `#systemDetailsKnowledgeList`
- Location drilldown: `appendLocationKnowledgeBlock()` in `lazyRenderLocationMissions()`
- **Not saved** — catalogue-only; no save envelope changes

---

## Faction & Territory Overlay (Phase 20)

- Catalogue fields on `starSystemsData`: `faction`, `influence` (future: `warZone`, `disputed`)
- Map layer group **Faction Territories** — six toggles using existing `.layer-match` / `.layer-faded`
- **Faction Summary** in layers panel — counts, mission progress, click → `highlightFactionTerritory()`
- System details panel — Faction + Influence lines via `getSystemFactionMeta()`
- Not persisted — no save changes

---

## Mission Badge Rules (map)

Priority for linked missions:
1. Any `active` → ⚠
2. All `completed` or `skipped` → ✓
3. Otherwise → ●
4. No linked missions → badge hidden

Updated by `syncSystemMissionBadge()` from `saveMissionState()` and on `renderStarmap()`.

---

## Known Constraints

- `renderStarmap()` uses `innerHTML = ''` — full rebind; search/layer classes re-applied after
- `planetData` is read-only catalogue (**149** entries); progress lives in `gameProgress.planets` via `savePlanetState()` only
- `locationData` is read-only catalogue (**37** entries); progress lives in `gameProgress.locations` via `saveLocationState()` only
- Many systems still have partial planet/location coverage; Pack 1 + Pack 2 prioritised 25 gameplay systems
- Catalogue validation runs in dev mode only; use `?catalogueDev=1` on any host to force console report
- Map layer toggles are display-only and not persisted
- Folder save requires Chrome/Edge File System Access API
- Details panel uses **planet drilldown** (Phase 13) — lazy tree for selected system only; `systemDetailsDrilldownState` is runtime-only, not saved

---

## Agent Workflow

1. Builder → implement in `Starmap - Fav v3 .html`
2. QA → test per `.cursor/rules/20-qa-agent.mdc`
3. Reporter → update README, CONTEXT, release notes, known issues
