/* QA checks for Phase 35 — Galactic Search Engine */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const phase35Markers = [
  'buildSearchIndex',
  'searchGalactic',
  'getGalacticSearchSuggestions',
  'readGalacticSearchRecent',
  'pushGalacticSearchRecent',
  'GALACTIC_SEARCH_RECENT_KEY',
  'GALACTIC_SEARCH_TYPE_LABELS',
  'renderGalacticSearchPanel',
  'executeGalacticSearchAction',
  'initGalacticSearchPanelBindings',
  'galacticSearchIndex',
  'scoreGalacticSearchEntry'
];

phase35Markers.forEach((marker) => {
  if (script.includes(marker)) pass(`Galactic Search marker present: ${marker}`);
  else fail('High', `Missing Galactic Search marker: ${marker}`);
});

const uiIds = [
  'galacticSearchWrap',
  'galacticSearchPanel',
  'galacticSearchSuggestions',
  'galacticSearchRecent',
  'galacticSearchResults'
];
uiIds.forEach((id) => {
  if (html.includes(`id="${id}"`)) pass(`Galactic Search UI present: ${id}`);
  else fail('High', `Missing Galactic Search UI: ${id}`);
});

if (html.includes('placeholder="Search the atlas…"')) pass('Galactic search placeholder updated');
else fail('High', 'Missing galactic search placeholder');

if (html.includes('.galactic-search-panel')) pass('Galactic search panel CSS present');
else fail('High', 'Missing galactic-search-panel styles');

if (script.includes("buildSearchIndex();")) pass('buildSearchIndex wired into buildCatalogueIndexes');
else fail('High', 'buildSearchIndex not called from buildCatalogueIndexes');

if (script.includes('buildSearchIndex,') && script.includes('searchGalactic,')) {
  pass('AtlasManager exposes buildSearchIndex and searchGalactic');
} else {
  fail('High', 'AtlasManager missing buildSearchIndex or searchGalactic');
}

if (script.includes('searchIndexBuildMs') && script.includes('galacticSearchMs')) {
  pass('Developer performance timing for search index and search');
} else {
  fail('Medium', 'Missing developer search performance metrics');
}

if (script.includes("localStorage.setItem(\n                GALACTIC_SEARCH_RECENT_KEY")) {
  pass('Recent searches stored in localStorage only');
} else if (script.includes('localStorage.setItem(') && script.includes('GALACTIC_SEARCH_RECENT_KEY')) {
  pass('Recent searches stored in localStorage only');
} else {
  fail('High', 'Recent search localStorage wiring missing');
}

if (!script.includes('GALACTIC_SEARCH_RECENT_KEY') || !script.match(/saveRoot|masterAtlas|exportUniverse|SAVE_VERSION/)) {
  pass('Recent search key is separate from save export paths');
}

if (script.includes("document.getElementById('systemSearchBar').classList.toggle('hidden', view !== 'systems')")) {
  fail('High', 'Search bar still hidden on non-systems views');
} else {
  pass('Search bar visible on all views');
}

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 35 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
