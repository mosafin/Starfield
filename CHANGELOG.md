# Changelog

All notable changes to the Starfield Starmap Explorer are documented here.

## [1.0.0-rc] — 2026-06-28

### Release Candidate
- **Version 1.0.0 RC** — production-ready atlas for player testing
- `ATLAS_APP_VERSION = '1.0.0'` exposed via `AtlasManager.appVersion`
- Full regression suite: `node scripts/run-full-regression.js`
- Save compatibility tests: fresh, mid-game, late-game, legacy v1, export/import
- Performance baseline: `docs/performance-baseline-v1.0.0.json`
- Release package: `release/starfield-atlas-v1.0.0/`
- Documentation: Installation, Backup & Restore, Browser Compatibility, Future Roadmap

### Added (Phases 37–39)
- **Atlas Insights** — forecasts, heatmaps, recommendations (Phase 37)
- **Shattered Space DLC pack** — modular pack loading via Atlas Registry (Phase 38)
- **Keyboard shortcuts** — Ctrl+K search, Esc close, arrows in search, F focus system, ? help (Phase 39)
- **`AtlasManager.getAtlasHealthReport()`** — validation, packs, search index, caches, performance (Phase 39)
- **`prefers-reduced-motion`** support (Phase 40)

### Changed
- Unified empty-state styling, focus outlines, and subtle panel transitions (Phase 39)
- Responsive top-bar tuning for 1280–1920px widths (Phase 39)
- Improved error messages for missing catalogue/map/knowledge references (Phase 39)

### Fixed
- Fleet index initialization order regression (Phase 36 hotfix)
- Phases 23–25 QA view-tab count (13 tabs after Fleet + Insights)

### Unchanged
- Save format remains **v2**
- Vanilla star map coordinates and Phase 9 spacing
- Catalogue counts (no expansion in Phase 40)

## Prior phases (22–36)

See `docs/release-notes/2026-06-28-phases-22-40-release-summary.md` and individual phase notes in `docs/release-notes/`.
