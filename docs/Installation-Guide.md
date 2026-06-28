# Installation Guide — Starfield Starmap Explorer v1.0.0

## Requirements

- A modern desktop browser (Chrome, Edge, Firefox, or Safari)
- No install wizard, account, or server required
- Optional internet on **first load** for CDN fonts and icons (cached afterward)

## Quick start

1. Download or clone this repository.
2. Open **`Starmap - Fav v3 .html`** by double-clicking it, or drag it into your browser.
3. **Chrome or Edge** recommended if you want folder-based save/load.

That is the entire installation.

## First launch checklist

1. Confirm the map shows **120** star systems.
2. Click **Missions** — you should see **122** mission cards.
3. Press **Ctrl+K** — Galactic Search should open.
4. Press **?** — keyboard shortcut help should appear.
5. Mark one system explored, reload the page — progress should persist (localStorage).

## Folder save (Chrome / Edge only)

1. Top-right **More ▾ → Save to folder…**
2. Choose or create a folder.
3. The app writes `atlas-save.json` into that folder.
4. **Open from folder…** reloads the same file on next session.

Firefox and Safari do not support the folder picker. Use **Export Atlas** and **Open save** instead (see [Backup & Restore Guide](Backup-Restore-Guide.md)).

## Developer / catalogue mode

Append `?catalogueDev=1` to the URL, or open from `file://` / `localhost` to enable:

- Console validation on load
- `AtlasManager.getAtlasHealthReport()`
- Loaded Packs dev panel (More ▾ → Loaded Packs)

## Updating

Replace `Starmap - Fav v3 .html` with the new file. Hard-refresh (**Ctrl+F5**) if the map looks stale.

Your save file format (v2) is unchanged across v1.0.x updates.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page | Enable JavaScript; try Chrome/Edge |
| Old UI after update | Hard refresh (**Ctrl+F5**) |
| Save not loading | Confirm JSON has `"version": 2` at top level |
| Fonts look plain | Go online once, or ignore — app works without CDN |

See [Browser Compatibility](Browser-Compatibility.md) and [known-issues.md](known-issues.md).
