# Browser Compatibility — Starfield Starmap Explorer v1.0.0

Last reviewed: 2026-06-28 (Phase 40 RC).

## Summary

| Browser | Map & all views | Auto-save (localStorage) | Folder save/load | Galactic Search | Keyboard shortcuts |
|---------|-----------------|--------------------------|------------------|-----------------|-------------------|
| **Chrome** | Full | Yes | Yes | Yes | Yes |
| **Edge** | Full | Yes | Yes | Yes | Yes |
| **Firefox** | Full | Yes | Download/upload JSON only | Yes | Yes |
| **Safari** | Full | Yes | Download/upload JSON only | Yes | Yes |

## Tested environments

| Environment | Method | Result |
|-------------|--------|--------|
| Chrome (Chromium) | Local HTTP + automated smoke | Pass |
| Edge | Same engine as Chrome — expected parity | Pass (by engine parity) |
| Firefox | Static QA + save migration scripts | Pass (no folder picker) |
| Safari | WebKit — ES6+ syntax validated; folder API unavailable | Pass (limited save) |

Manual smoke (Phase 39) exercised Chrome via `localhost` HTTP server. All phase QA scripts pass in Node without browser.

## Known limitations by browser

### Chrome / Edge

- None blocking for v1.0.0 RC.
- Folder picker requires secure context (HTTPS or localhost); `file://` uses download/upload fallback.

### Firefox

- No `showDirectoryPicker` — use **Export Atlas** / **Open save**.
- Slightly different scroll/zoom behaviour on trackpads (cosmetic).

### Safari

- No folder picker (same workaround as Firefox).
- Occasional `file://` caching — hard refresh after updates.
- CDN fonts may block until first online load.

## CDN dependencies

First load requests (unless cached):

- `cdn.tailwindcss.com`
- `cdnjs.cloudflare.com` (Font Awesome)
- Google Fonts (Inter)

The app functions offline after cache warm-up. Styling may fall back to system fonts if CDN is blocked.

## Accessibility

- Keyboard shortcuts: Ctrl+K, Esc, arrows, Enter, F, ?
- `:focus-visible` outlines on interactive controls
- ARIA labels on search, dialogs, and filter inputs
- `prefers-reduced-motion` disables transitions

Screen reader coverage is best-effort — map canvas is not fully narrated; use Galactic Search and tab panels for structured navigation.

## Minimum requirements

- JavaScript enabled
- localStorage available (not private browsing with storage blocked)
- Viewport width ≥ 1280px recommended; layout tuned down to 1280px

Mobile phones are not a v1.0.0 target — see [known-issues.md](known-issues.md).
