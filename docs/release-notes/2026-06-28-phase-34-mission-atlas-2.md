# Feature Report — Mission Atlas 2.0 (Phase 34)
Date: 2026-06-28

## What Changed

Upgraded the mission tracker into a **Mission Atlas** with optional catalogue metadata, expanded mission detail cards, richer search/filters, mission chain display, and cross-links to systems, locations, knowledge, and timeline.

## Why It Matters

The location atlas answers *where* places are. The Mission Atlas answers *what happens there* — start points, prerequisites, follow-ups, recommended level, and travel context — without leaving the starmap.

## Mission Metadata (catalogue-only)

All fields optional; `null` / `[]` where unknown:

```js
{
  id, title, category, faction,
  startsAtLocationId, primarySystemId, primaryPlanetId, primaryLocationId,
  recommendedLevel, estimatedLength,
  prerequisites: [], followUpMissions: [], rewards: [], choices: [],
  notes: ""
}
```

Legacy fields (`group`, `systemId`, `locationName`, `previousMissionId`, `nextMissionId`) remain for compatibility.

## Categories

Main Story · Faction · Side Quest · Activity · Miscellaneous · DLC

Derived from existing mission groups via `MISSION_GROUP_TO_CATEGORY`.

## UI (no layout redesign)

- Expanded mission cards with scrollable **Mission Atlas detail** section
- Filters: category, faction, recommended level, status, completed/active/not started, has choices, has rewards
- Search: title, faction, reward text, location, system
- Cross-link buttons: Show on Map, Timeline, Knowledge

## Atlas Manager

- `getAtlasStatistics().missionAtlasCoverage` — metadata, location, reward, prerequisite, follow-up coverage %
- `getExpansionReadiness()` — `missionsMissingLocations`, `missionsMissingRewards`, `missionsMissingPrerequisites`, `missionsMissingFollowUps`

## Indexes

`missionsByPrimaryLocationId`, `locationsByMissionId`, `knowledgeByMissionId` — no repeated `missionData` scans at runtime.

## Save

Save v2 unchanged. Mission metadata is read-only catalogue; player progress still uses `gameProgress.missions`.

## QA

- `qa-phase-34-check.js` — Mission Atlas markers, filters, cross-links, save v2
