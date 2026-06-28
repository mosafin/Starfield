# Starfield Starmap — Project Memory



Offline single-file starmap + mission tracker for *Starfield*.

**Version 1.0.0 RC** (2026-06-28)



- **App:** `Starmap - Fav v3 .html` — `ATLAS_APP_VERSION = '1.0.0'`

- **Docs:** `README.md`, `CHANGELOG.md`, `docs/Installation-Guide.md`, `docs/Backup-Restore-Guide.md`, `docs/Browser-Compatibility.md`

- **Save shape (v2):** `{ version, activeUniverseId, universes, masterAtlas }`

- **Catalogues:** `starSystemsData` (120), `missionData` (122), `planetData` (**558**), `locationData` (**63**), `knowledgeData` (**45**)

- **Atlas manager:** `validateAtlas()`, `getAtlasStatistics()`, `getAtlasHealthReport()`, `AtlasManager` (`appVersion`, `saveVersion`)

- **Regression:** `node scripts/run-full-regression.js`

- **Release package:** `release/starfield-atlas-v1.0.0/`

- **Performance baseline:** `docs/performance-baseline-v1.0.0.json`

- **Release notes (RC):** `docs/release-notes/2026-06-28-version-1.0.0-rc.md`

- **Release summary (Phases 22–40):** `docs/release-notes/2026-06-28-phases-22-40-release-summary.md`

- **QA:** `qa-phase-40-check.js`, `run-full-regression.js`, `qa-save-compatibility-check.js`, `qa-performance-baseline.js`
