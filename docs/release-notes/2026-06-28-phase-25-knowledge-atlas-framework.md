# Feature Report — Knowledge Atlas Framework (Phase 25)
Date: 2026-06-28

## What Changed

Added a tenth tab — **Knowledge Atlas** — plus a read-only `knowledgeData` catalogue with search, category filters, system/location integration, and starter seed entries.

## Why It Matters

The atlas already tracks where things are on the map. The Knowledge Atlas begins answering **what exists there** — companions, homes, vendors, and unique content — without leaving the app.

## UI / Layout Review (pre-implementation)

- Tab row uses `flex-wrap` with slightly smaller tab labels (0.58rem) to fit 10 tabs without overlapping search or save controls.
- `syncTopUiLayout()` + `ResizeObserver` unchanged; details panel sticky header preserved.
- No new fixed overlays beyond the full-screen panel pattern used by other atlas tabs.

## Files Updated

- `Starmap - Fav v3 .html` — `knowledgeData`, indexes, Knowledge Atlas panel, system/location integration
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`
- `scripts/qa-static-check.js` — Knowledge Atlas DOM + helper checks

## User-Facing Behaviour

### Knowledge Atlas tab
- Search title, type, tags
- Category filter: Vendors · Powers · Temples · Companions · Homes · Unique Items
- Type filter for all supported entry types
- Cards with description, tags, **Show on Map**

### Starter seed (8 entries)
- Companions: Sarah Morgan, Andreja, Barrett, Sam Coe
- Homes: Mercury Tower Penthouse, Dream Home
- Unique: The Lodge
- Powers: catalogue framework placeholder

### System / location integration
- System details: **Knowledge Entries: X** + bullet list
- Location drilldown: linked knowledge block when expanded

## Technical Notes

- Catalogue-only — **not saved**; no save migration
- Indexes built in existing `buildCatalogueIndexes()`
- `validateKnowledgeData()` included in dev catalogue health report

## QA Summary

Static checks extended; migration tests unchanged (8/8).

## Known Issues

Starter seed only — see `docs/known-issues.md`.

## Next Phase Recommendation

Knowledge Pack 1 — expand vendors, magazines, and powers with validated `locationId` links.
