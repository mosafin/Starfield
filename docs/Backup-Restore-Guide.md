# Backup & Restore Guide — Starfield Starmap Explorer v1.0.0

## Save format (v2)

```json
{
  "version": 2,
  "activeUniverseId": "universe_1",
  "universes": {
    "universe_1": { "name": "Universe 1", "systems": {}, "missions": {}, "planets": {}, "locations": {}, "routes": {}, "fleet": {}, "milestones": {} },
    "universe_2": { ... },
    "universe_3": { ... },
    "universe_4": { ... }
  },
  "masterAtlas": {
    "systemsVisited": {},
    "planetsSurveyed": {},
    "locationsDiscovered": {},
    "discoveryIds": {},
    "totalDiscoveries": 0
  }
}
```

Progress auto-saves to **localStorage** in your browser whenever you change exploration, missions, planets, locations, fleet, or discoveries.

## Export options

| Action | Menu | What it saves |
|--------|------|----------------|
| **Export Atlas** | More ▾ (top-right) | Full v2 envelope — all 4 universes + Master Atlas |
| **Export Universe** | More ▾ | Single active universe profile only |
| **Save to folder…** | More ▾ (Chrome/Edge) | Writes `atlas-save.json` to a chosen folder |

## Import options

| Action | Behaviour |
|--------|-----------|
| **Open save** | File picker — merges or replaces per format (see below) |
| **Open from folder…** | Chrome/Edge — reads `atlas-save.json` from chosen folder |

### Full atlas import

Loading a complete **Export Atlas** JSON **replaces all four universe slots** with file contents. Universes not in the file start empty.

### Single universe import

**Export Universe** + Open save merges into **one profile only** — other universes are not wiped.

### Legacy saves

These migrate automatically into **Universe 1**:

- Flat `{ "narion": { "explored": true, ... } }` (pre-v2)
- `{ "systems": {}, "missions": {}, "planets": {}, "locations": {} }` envelope

## Recommended backup routine

1. **Weekly:** Export Atlas → store as `atlas-backup-YYYY-MM-DD.json`
2. **Before NG+:** Export Universe for the run you are finishing
3. **Before app update:** Export Atlas (one file, all progress)

Keep backups outside the browser (cloud drive, USB, etc.). localStorage is cleared if you wipe browser data.

## What is NOT saved

- Map layer toggles
- Galactic Search recent terms (localStorage only, separate key)
- Compare mode selection
- Command Center / Insights / Timeline generated views
- UI panel scroll positions

## Restore procedure

1. Open the atlas HTML file.
2. More ▾ → **Open save** (or Open from folder).
3. Select your `.json` backup.
4. Confirm **Current Universe** dropdown shows expected profile.
5. Spot-check: explored systems, one mission status, one discovery entry.

## NG+ and Master Atlas

- **Fresh Map** / **Reset Exploration** clears **system map progress only** — missions, planets, locations, fleet, and discoveries are kept.
- **Master Atlas** accumulates lifetime stats across universes and is **never** cleared by Fresh Map.

## Verified scenarios (automated)

`scripts/qa-save-compatibility-check.js` and `scripts/qa-migration-check.js` verify:

- Fresh empty save
- Mid-game progress (systems, missions, survey)
- Late-game progress (fleet, routes, discoveries, masterAtlas)
- Legacy v1 flat save migration
- Full export round-trip
- Universe-only export shape
