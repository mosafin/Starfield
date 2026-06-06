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

if (script.includes('renderCommandCenterPanel') && script.includes('getCommandCenterRecommendations')) {
  pass('Command Center dashboard helpers present');
} else fail('High', 'Missing Command Center dashboard helpers');

if (script.includes('renderRoutePlannerPanel') && script.includes('recomputeRoutePlannerPath') && script.includes('routes: {}')) {
  pass('Route Planner helpers and routes save slot present');
} else fail('High', 'Missing Route Planner helpers or routes save slot');

if (script.includes('knowledgeData') && script.includes('renderKnowledgeAtlasPanel') && script.includes('getKnowledgeForSystem')) {
  pass('Knowledge Atlas catalogue and panel helpers present');
} else fail('High', 'Missing Knowledge Atlas helpers');

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

console.log('=== QA Static Check ===');
console.log('Passes:', passes.length);
passes.forEach(p => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach(i => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some(i => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
