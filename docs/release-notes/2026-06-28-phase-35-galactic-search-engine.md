# Phase 35 — Galactic Search Engine

**Date:** 2026-06-28  
**Scope:** Unified global search across all atlas catalogues from one search box.

## Summary

Players can search once from the top-centre **Search the atlas…** bar on any view. Results span systems, planets, locations, missions, knowledge, resources, discoveries, saved routes, timeline events, and planned outposts.

## Features

### Global Search
- Single search box visible on **all views** (no longer Star Systems only)
- Dropdown panel with grouped results, autocomplete suggestions, and recent searches

### Search Ranking
Weighted relevance scoring prioritises:
- Exact title match
- Type boosts (systems, missions, locations, knowledge, planets, resources)
- Description / haystack matches
- Recency bonus for timeline events (7-day / 30-day windows)

### Search Index
- `buildSearchIndex()` — pre-indexes catalogue data via Atlas Registry indexes (no repeated full catalogue scans at search time)
- Dynamic entries (discoveries, routes, timeline, outposts) merged at search time from save/universe state

### Quick Actions
Each result supports contextual actions:
- **Show On Map** (when a system is linked)
- **Open Details** / **Open Mission** / **Open Knowledge**
- **Compare** (when a system is linked)

### Recent Searches
- Up to **10** terms in `localStorage` (`starmap_galactic_search_recent`)
- **Not** exported or synced to save files

### Developer Tools
- `AtlasManager.buildSearchIndex()`
- `AtlasManager.searchGalactic(query)`
- `AtlasManager.measureAtlasPerformance()` — adds `searchIndexBuildMs`, `galacticSearchMs`, `galacticSearchResultCount`
- Dev-mode timing line in search panel footer

## Unchanged

- Save v2 schema
- Star coordinates and Phase 9 spacing
- Per-view filters (Missions, Knowledge, Timeline, etc.) remain independent

## QA

Run `node scripts/qa-phase-35-check.js`

**Release summary:** `2026-06-28-phases-22-35-release-summary.md`
