# Starfield Atlas v1.0.0 — Release Package

## Contents

| File | Purpose |
|------|---------|
| `VERSION.json` | Machine-readable version and catalogue totals |
| `LICENSE` | MIT licence + fan-project disclaimer |
| `CREDITS.md` | Attribution |
| `THIRD-PARTY-NOTICES.md` | CDN dependencies |
| `icon.svg` | App icon (128×128) |
| `PACKAGE.md` | This manifest |

## Application file

The playable app is the single HTML file at the repository root:

```
Starmap - Fav v3 .html
```

Distribute that file together with this folder, or zip both for sharing.

## Recommended zip layout

```
starfield-atlas-v1.0.0/
├── Starmap - Fav v3 .html
├── README.md
├── CHANGELOG.md
├── VERSION.json
├── LICENSE
├── CREDITS.md
├── THIRD-PARTY-NOTICES.md
├── icon.svg
└── docs/
    ├── Installation-Guide.md
    ├── Backup-Restore-Guide.md
    └── Browser-Compatibility.md
```

## Verification

After unpacking, run from the project root:

```bash
node scripts/run-full-regression.js
node scripts/qa-performance-baseline.js
```

Open the HTML in Chrome or Edge. Press **?** for keyboard shortcuts.

## Save format

Save version **2** — `{ version, activeUniverseId, universes, masterAtlas }`.
Unchanged since Phase 19.
