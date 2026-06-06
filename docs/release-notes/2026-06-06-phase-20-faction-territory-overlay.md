# Feature Report — Faction & Territory Overlay (Phase 20)
Date: 2026-06-06

## What Changed

Added catalogue faction metadata for all 120 systems, a **Faction Territories** map layer group, faction summary panel with mission progress, and faction/influence lines in the system details panel.

## Why It Matters

Players can see which systems belong to the UC, Freestar Collective, Crimson Fleet, House Va'ruun, or independent space — and highlight those regions on the map without changing save data.

## Files Updated

- `Starmap - Fav v3 .html` — faction metadata, layers, summary panel, details integration
- `README.md`, `CONTEXT.md`, `memory/README.md`

## User-Facing Behaviour

- **Map layers → Faction Territories** — six faction toggles (single-select within group)
- **Faction Summary** — system counts; UC/Freestar/Crimson mission completed counts; click row to highlight territory
- **System details** — Faction and Influence (Major/Minor) lines
- Uses existing `.layer-match` / `.layer-faded` highlight styles

## Technical Notes

- `SYSTEM_FACTION_LISTS` + `applySystemFactionMetadata()` at bootstrap on `starSystemsData`
- Optional fields: `faction`, `influence`; reserved for `warZone`, `disputed`
- Unassigned systems default to Unknown / minor
- No save structure changes — catalogue-only

## QA Summary

Static review: layer OR-logic with search, details panel, mission badges, save payload unchanged.

## Known Issues

- Faction assignments are atlas approximations, not in-game political boundaries
- House Va'ruun / Independent / Unknown have no faction mission questline in catalogue

## Next Phase Recommendation

`warZone` / `disputed` overlay layers when catalogue data is extended.
