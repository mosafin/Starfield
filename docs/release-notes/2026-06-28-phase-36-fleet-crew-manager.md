# Phase 36 — Fleet & Crew Manager

**Date:** 2026-06-28  
**Scope:** Player fleet, crew, and homes integrated into the atlas with search, timeline, and map navigation.

## Summary

The atlas now tracks player-owned ships, crew assignments, and homes per universe. Open **More ▾ → Fleet Manager** to add and edit records; everything saves with your universe progress.

## Save Schema (v2 extension)

Each universe now includes (backward-compatible migration):

```json
{
  "fleet": { "ships": { } },
  "crew": { "members": { } },
  "homes": { "currentHomeId": null, "owned": { } }
}
```

- Old saves migrate automatically via `ensureFleetProgressStructure()`
- Export Universe includes fleet, crew, and homes

## Features

### Fleet Manager view
- Summary: Ships · Crew · Homes · Assignments
- Sections: Ships, Crew, Homes, Assignments
- Add Ship / Add Crew / Add Home buttons
- Inline editable detail cards

### Ship records
`id`, `name`, `class`, `manufacturer`, `homeSystemId`, `currentSystemId`, `cargoRole`, `notes` — unknown values supported

### Crew records
Companions, generic crew, special crew — assignment, ship, system, companion status, knowledge link, recruitment location from Knowledge Atlas

### Homes
Apartment, Penthouse, Dream Home, Sleepcrate, Outpost Housing — current home flag, owned homes list

### Integrations
- **Galactic Search** — ships, crew, homes, assignments
- **Timeline** — Ship Added, Crew Assigned, Crew Reassigned, Home Purchased (Fleet filter)
- **Show on Map** — ships, crew, homes with linked systems
- **Knowledge** — companion crew links to Knowledge Atlas entries
- **AtlasManager.getAtlasStatistics().playerFleet** — counts for active universe

## Developer

- `rebuildFleetIndexes()` — indexed lookups by ship/crew/home (no repeated scans)
- `getFleetStatistics()` — ships, crew, homes, assignments counts
- `AtlasManager.rebuildFleetIndexes()`, `.getFleetStatistics()`

## Unchanged

- Save version remains **v2**
- Star coordinates and Phase 9 spacing
- Mission Atlas, Knowledge Atlas core catalogues

## QA

Run `node scripts/qa-phase-36-check.js`

**Release summary:** `2026-06-28-phases-22-37-release-summary.md`
