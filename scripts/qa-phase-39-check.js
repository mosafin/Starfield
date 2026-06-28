/* QA checks for Phase 39 — Atlas Experience & Polish */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const phase39Markers = [
  'getAtlasHealthReport',
  'initAtlasKeyboardShortcuts',
  'openGalacticSearchFocus',
  'closeAllAtlasOverlays',
  'resetGalacticSearchHighlight',
  'moveGalacticSearchHighlight',
  'activateGalacticSearchHighlightedItem',
  'focusCurrentSystemOnMap',
  'openShortcutsHelp',
  'warnMissingAtlasReference',
  'atlasStartupMs',
  'shortcutsHelpOverlay'
];

phase39Markers.forEach((marker) => {
  if (script.includes(marker)) pass(`Polish marker present: ${marker}`);
  else fail('High', `Missing polish marker: ${marker}`);
});

if (script.includes('getAtlasHealthReport,') || script.includes('getAtlasHealthReport')) {
  pass('AtlasManager exposes getAtlasHealthReport');
} else {
  fail('High', 'AtlasManager missing getAtlasHealthReport');
}

if (html.includes('focus-visible')) pass('Focus-visible accessibility styles present');
else fail('High', 'Missing focus-visible styles');

if (html.includes('@media (max-width: 1280px)')) pass('Responsive layout breakpoints present');
else fail('Medium', 'Missing 1280px responsive rules');

if (script.includes("e.key.toLowerCase() === 'k'")) pass('Ctrl+K search shortcut wired');
else fail('High', 'Ctrl+K shortcut missing');

if (script.includes('moveGalacticSearchHighlight')) pass('Arrow key search navigation present');
else fail('High', 'Arrow key navigation missing');

if (script.includes('initAtlasKeyboardShortcuts()')) pass('Keyboard shortcuts initialized on load');
else fail('High', 'Keyboard shortcuts not initialized');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 39 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
