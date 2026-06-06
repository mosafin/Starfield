# Feature Report — Resource Filter Reset (Phase 15 QA Fix)
Date: 2026-06-06

## What Changed

Fixed resource atlas map-highlight behaviour and added a persistent **Reset filter** control on the Star Systems view.

## Why It Matters

After **Show on Map** or **Highlight on Map**, players can clear the purple resource highlight and faded systems in one click — and the reset stays cleared when switching tabs.

## Files Updated

- `Starmap - Fav v3 .html` — `#resourceFilterBar`, highlight lifecycle fixes
- `README.md` — Resource filter bar controls
- `CONTEXT.md` — highlight/set/clear function behaviour
- `docs/release-notes/2026-06-06-phase-15-galaxy-resource-atlas.md` — QA fix section

## User-Facing Behaviour

- **Resource filter: [name]** bar appears under the search bar when a resource is highlighted on the map
- **Reset filter** removes highlight and restores all system labels
- Typing in the Resources tab search updates results only — map unchanged until **Highlight on Map** or **Show on Map**
- Clicking ✓ Iron in planet drilldown opens Resources filtered — no map highlight until explicit map action

## Technical Notes

- `resourceAtlasHighlightResource` — runtime only; not saved
- `renderResourceAtlasPanel()` no longer calls `setResourceAtlasHighlight()`
- `getPrimaryAtlasResource()` returns `null` for ambiguous multi-match partial queries (card border emphasis only)
- `shouldIgnorePanStart()` includes `.resource-filter-bar`

## QA Summary

**PASS** — Static re-check confirmed all three prior High/Medium bugs resolved.

## Known Issues

None blocking. See parent Phase 15 report for Nickel catalogue gap and map-layer coverage.

## Next Phase Recommendation

Optional: clear Resources search input when **Reset filter** is clicked (UX polish only).
