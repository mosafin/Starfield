/* Static QA checks for Starmap - Fav v3 .html (Phases 17-20) */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];

function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

// Syntax
try { new Function(script); pass('JavaScript parses without syntax errors'); }
catch (e) { fail('Critical', 'JS syntax: ' + e.message); }

// Required DOM ids
const requiredIds = [
  'universeSelect', 'universesPanel', 'viewUniversesBtn',
  'commandCenterPanel', 'viewCommandBtn', 'commandCenterContent',
  'routePlannerPanel', 'viewRouteBtn', 'routePlannerContent', 'routeFilterBar',
  'knowledgeAtlasPanel', 'viewKnowledgeBtn', 'knowledgeList',
  'systemDetailsFaction', 'systemDetailsInfluence', 'discoveriesPanel',
  'discoveryModalOverlay', 'mapLayer_faction_uc'
];
const dynamicIds = ['factionSummaryPanel'];
requiredIds.forEach((id) => {
  if (html.includes(`id="${id}"`) || html.includes(`id='${id}'`) || html.includes(`mapLayer_${id.replace('mapLayer_', '')}`)) {
    pass(`DOM/id reference: ${id}`);
  } else if (id.startsWith('mapLayer_')) {
    if (script.includes(`'${id.replace('mapLayer_', '')}'`) || html.includes(id)) pass(`Layer id: ${id}`);
    else fail('High', `Missing layer checkbox id pattern for ${id}`);
  } else {
    fail('High', `Missing element id: ${id}`);
  }
});
dynamicIds.forEach((id) => {
  if (script.includes(`id="${id}"`) || script.includes(`id='${id}'`) || script.includes(`getElementById('${id}')`) || script.includes(`id = '${id}'`)) {
    pass(`Dynamic DOM id: ${id}`);
  } else {
    fail('High', `Missing dynamic element id: ${id}`);
  }
});

// System count
const systemIds = [...script.match(/const starSystemsData = \[([\s\S]*?)\];\s*\n\s*const SYSTEM_FACTION_LISTS/m)[1].matchAll(/id: '([^']+)'/g)].map(m => m[1]);
if (systemIds.length === 120) pass('starSystemsData has 120 systems');
else fail('High', `Expected 120 systems, got ${systemIds.length}`);

// Mission count
const missionBlock = script.match(/const missionData = \[([\s\S]*?)\];\s*\n\s*const FACTION_PROGRESS/m)[1];
const missionIds = [...missionBlock.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
if (missionIds.length === 122) pass('missionData has 122 missions');
else fail('High', `Expected 122 missions, got ${missionIds.length}`);

// Save payload shape
if (script.includes('universes: saveRoot.universes') && script.includes('masterAtlas: saveRoot.masterAtlas')) {
  pass('getSavePayload returns v2 universe envelope');
} else fail('Critical', 'getSavePayload missing v2 fields');

if (script.includes('migrateSaveToUniverseFormat') && script.includes('normalizeLegacyEnvelope')) {
  pass('Legacy save migration functions present');
} else fail('Critical', 'Missing migration functions');

if (script.includes('getUILayoutReport') && script.includes('UI_LAYOUT_TARGETS')) {
  pass('UI layout diagnostics: getUILayoutReport');
} else fail('High', 'Missing getUILayoutReport helper');

if (script.includes('getAtlasDataReadinessReport') && script.includes('readyForExpansion')) {
  pass('Catalogue readiness: getAtlasDataReadinessReport');
} else fail('High', 'Missing getAtlasDataReadinessReport');

if (script.includes('function validateAtlas(') && script.includes('function rebuildAtlasIndexes(')) {
  pass('Atlas manager: validateAtlas + rebuildAtlasIndexes');
} else fail('High', 'Missing Atlas manager validation pipeline');

if (script.includes('AtlasManager') && script.includes('getAtlasStatistics')) {
  pass('Atlas manager: statistics API');
} else fail('High', 'Missing Atlas statistics API');

if (script.includes('function getAtlasCompletenessReport(')) {
  pass('Atlas manager: completeness report');
} else fail('High', 'Missing getAtlasCompletenessReport');

const planetBlockStatic = script.match(/const planetData = \[([\s\S]*?)\n        \];/);
const planetCountStatic = planetBlockStatic ? (planetBlockStatic[1].match(/id: '/g) || []).length : 0;
if (planetCountStatic >= 550) pass(`planetData Core Atlas count: ${planetCountStatic}`);
else fail('High', `Expected at least 550 planets, got ${planetCountStatic}`);

const locationBlockStatic = script.match(/const locationData = \[([\s\S]*?)\n        \];/);
const locationCountStatic = locationBlockStatic ? (locationBlockStatic[1].match(/id: '/g) || []).length : 0;
if (locationCountStatic >= 62) pass(`locationData Core Atlas count: ${locationCountStatic}`);
else fail('High', `Expected at least 62 locations, got ${locationCountStatic}`);

if (html.includes('id="viewTabsMoreBtn"') && script.includes('initViewTabsMoreMenu')) {
  pass('View navigation: More menu for secondary tabs');
} else fail('High', 'Missing view tabs More menu');

if (script.includes('renderCommandCenterPanel') && script.includes('getCommandCenterRecommendations')) {
  pass('Command Center dashboard helpers present');
} else fail('High', 'Missing Command Center dashboard helpers');

if (script.includes('renderRoutePlannerPanel') && script.includes('recomputeRoutePlannerPath') && script.includes('routes: {}')) {
  pass('Route Planner helpers and routes save slot present');
} else fail('High', 'Missing Route Planner helpers or routes save slot');

if (script.includes('knowledgeData') && script.includes('renderKnowledgeAtlasPanel') && script.includes('getKnowledgeForSystem')) {
  pass('Knowledge Atlas catalogue and panel helpers present');
} else fail('High', 'Missing Knowledge Atlas helpers');

const knowledgeBlockStatic = script.match(/const knowledgeData = \[([\s\S]*?)\];/);
const knowledgeCountStatic = knowledgeBlockStatic ? (knowledgeBlockStatic[1].match(/id: '/g) || []).length : 0;
if (knowledgeCountStatic >= 40) pass(`knowledgeData Pack 2 count: ${knowledgeCountStatic}`);
else fail('High', `Expected at least 40 knowledge entries, got ${knowledgeCountStatic}`);

if (html.includes('id="mapControlsMoreBtn"') && html.includes('id="mapControlsMoreMenu"')) {
  pass('Compact map controls: More menu');
} else fail('High', 'Missing compact More menu controls');

if (script.includes('syncMapFilterBarLayout') && script.includes('--route-filter-bar-top-offset')) {
  pass('Stacked map filter bars (resource + route)');
} else fail('Medium', 'Missing stacked map filter bar layout');

['resource-filter-bar', 'route-filter-bar'].forEach((cls) => {
  if (script.includes(`.${cls}`) || script.includes(`'${cls}'`)) pass(`Pan ignore: ${cls}`);
  else fail('Medium', `shouldIgnorePanStart may miss .${cls}`);
});

if (script.includes('DISCOVERY_JOURNAL_KEY') && script.includes('mergeDiscoveryJournal')) {
  pass('Discovery journal save path intact');
} else fail('High', 'Discovery journal merge missing');

// Faction layers
const factionLayerIds = ['faction_uc', 'faction_freestar', 'faction_crimson_fleet', 'faction_house_varuun', 'faction_independent', 'faction_unknown'];
factionLayerIds.forEach((id) => {
  if (script.includes(`id: '${id}'`)) pass(`Faction layer defined: ${id}`);
  else fail('High', `Missing faction layer: ${id}`);
});

if (script.includes('MAP_LAYER_FACTION_IDS.has(layerId)')) pass('systemMatchesLayer handles faction layers');
else fail('High', 'Faction layer matching not wired');

// Pan ignore panels
['universes-panel', 'discoveries-panel', 'command-center-panel', 'route-planner-panel', 'knowledge-atlas-panel', 'discovery-modal-overlay', 'top-ui-chrome'].forEach((cls) => {
  if (script.includes(`.${cls}`) || script.includes(`'${cls}'`)) pass(`Pan ignore: ${cls}`);
  else fail('Medium', `shouldIgnorePanStart may miss .${cls}`);
});

// Duplicate faction list entries (border systems)
const listsSrc = script.match(/const SYSTEM_FACTION_LISTS = Object\.freeze\(\{([\s\S]*?)\}\);/)[1];
const listObj = {};
eval('listObj.data = {' + listsSrc + '}');
const seen = {};
Object.entries(listObj.data).forEach(([faction, tiers]) => {
  [...tiers.major, ...tiers.minor].forEach((id) => {
    if (!seen[id]) seen[id] = [];
    seen[id].push(faction);
  });
});
const dupes = Object.entries(seen).filter(([, arr]) => arr.length > 1);
if (dupes.length > 0) {
  fail('Low', `Systems listed under multiple factions (${dupes.length}): e.g. ${dupes[0][0]} → ${dupes[0][1].join(', ')}`);
} else pass('No duplicate faction list entries');

// Runtime init smoke test — catches TDZ / early bindActiveUniverse crashes
try {
  const vm = require('vm');
  const el = () => ({
    style: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    appendChild() {}, addEventListener() {}, removeEventListener() {},
    dataset: {}, setAttribute() {}, getAttribute: () => null,
    replaceChildren() {}, replaceChild() {}, remove() {},
    querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 }),
    textContent: '', innerHTML: '', value: '', checked: false, selectedIndex: 0, options: []
  });
  const sandbox = {
    document: {
      getElementById: () => el(),
      createElement: () => el(),
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      documentElement: { style: { setProperty: () => {} } },
      body: el()
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    performance: { now: () => Date.now() },
    URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
    ResizeObserver: class { observe() {} disconnect() {} },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    console
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { timeout: 15000 });
  if (typeof sandbox.renderStarmap === 'function') pass('Runtime init smoke test (renderStarmap available)');
  else fail('Critical', 'Runtime init completed but renderStarmap is missing');
} catch (e) {
  fail('Critical', 'Runtime init smoke test: ' + e.message);
}

console.log('=== QA Static Check ===');
console.log('Passes:', passes.length);
passes.forEach(p => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach(i => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some(i => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
