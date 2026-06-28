# Phase 37 — Atlas Insights & Intelligence

**Date:** 2026-06-28  
**Scope:** Generated analytics, forecasts, heatmaps, and recommendations from existing save and catalogue data.

## Summary

The atlas now explains what your progress means. Open **More ▾ → Insights** for exploration statistics, completion forecasts, ranked heatmaps, and actionable recommendations — all computed at view time from validated save data.

## Features

### Exploration Statistics
Systems explored/completed, planets surveyed, locations visited, knowledge entries seen, resources collected, missions completed, faction completion %, timeline events, ships, crew, homes.

### Completion Forecast
Estimated percentages for Main Story, faction storylines, exploration, survey, knowledge, and overall atlas completion.

### Exploration Heatmap (Top 10)
- Most visited systems
- Least explored systems
- Highest survey progress
- Most missions remaining
- Most knowledge remaining

### Recommendations (with reasons)
- Recommended next system — planning score from `computeSystemPlanningScores()`
- Recommended mission — `getRecommendedNextMissions()`
- Recommended survey target — systems closest to survey completion
- Recommended resource route — watchlist gaps or high-value outposts
- Recommended knowledge location — systems with most unseen knowledge

### Fleet, Resource, and Timeline Insights
- Most used ship, ships without crew, unused homes, crew without assignment
- Most common / rarest known resources, useful outposts, missing crafting chains (`RESOURCE_CATEGORIES`)
- Longest discovery gap, most active week, first system explored, latest discovery, latest outpost

## Engines

| Engine | Function | Notes |
|--------|----------|-------|
| Forecast | `computeAtlasInsights().completionForecast` | Reuses mission/survey/faction helpers |
| Recommendation | `computeAtlasInsights().recommendations` | Planning scores + existing mission/survey logic |
| Analytics | `computeAtlasInsights()` | Full snapshot for UI + stats |
| Cache | `getAtlasInsightsCached()` | Key: universe + save + timeline + catalogue versions |

Cache invalidates when:
- Save progress changes (`invalidateCommandCenterCache()`)
- Catalogue indexes rebuild (`rebuildAtlasIndexes()`)

## Developer

- `AtlasManager.getAtlasInsightsCached()`, `.computeAtlasInsights()`
- `getAtlasStatistics()` extended with `completionForecast`, `explorationRanking`, `knowledgeCoverage`, `playerInsights`
- `measureAtlasPerformance().atlasInsightsMs`

## Unchanged

- Save version remains **v2** — no insight fields persisted
- Star coordinates and Phase 9 spacing
- Mission Atlas, Knowledge Atlas, Galactic Search core behaviour

## QA

Run `node scripts/qa-phase-37-check.js`

**Release summary:** `2026-06-28-phases-22-37-release-summary.md`
