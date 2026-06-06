# Feature Report — Star System Spacing Polish
Date: 2026-06-06

## What Changed

Replaced broad percentage auto-nudging with small, manual pixel offsets on an inner `.system-marker` wrapper. Map anchors stay at canonical `x`/`y`; only the visible label/icon group shifts slightly in crowded regions.

## Why It Matters

Dense clusters (Sol area, Copernicus pair, Marae/Cheyenne, right-edge systems) were hard to read and easy to misclick. This adds breathing room without changing the map’s look, colours, or highlight behaviour.

## Files Updated

- `Starmap - Fav v3 .html` — `.system-marker` wrapper, `manualLabelOffsets`, layout report
- `README.md`, `CONTEXT.md`, `docs/known-issues.md`, `memory/README.md`

## User-Facing Behaviour

The map looks almost the same. Crowded names and icons sit slightly apart for readability. Search/layer glows, mission badges, explore/scan/note/details clicks all work as before. No leader lines.

## Technical Notes

- `.mappoint` at `system.x` / `system.y` (zero-size anchor)
- `.system-marker` carries flex layout, colours, explored styling, and `transform` offset via CSS vars
- Highlight box-shadows applied to `.system-marker` when parent has `.search-match`, `.layer-match`, `.mission-highlight`
- 21 systems in `manualLabelOffsets` (IDs: `celebria`, `maals`, `bannoc_secondus`)
- Removed `computeMapLabelOffsets()` percentage nudging
- Dev: `getGalaxyLayoutReport()` in catalogue dev mode

## Save Safety

No layout state in saves. `starSystemsData` coordinates unchanged.

## QA Summary

Automated smoke: 120 systems, canonical anchors, 21 manual offsets, highlights preserved, save envelope unchanged.

## Known Issues

Some overlap may remain outside the 21 manual-offset systems.

## Next Phase Recommendation

Tune additional offsets using layout report close pairs; optional leader lines only if spacing alone is insufficient.
