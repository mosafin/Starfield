/* QA checks for Phases 23–25 (Command Center, Route Planner, Knowledge Atlas) */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

// Save envelope unchanged at top level
if (/function getSavePayload\(\)[\s\S]*?return \{\s*version:[\s\S]*?universes: saveRoot\.universes,\s*masterAtlas: saveRoot\.masterAtlas\s*\}/.test(script)) {
  pass('getSavePayload top-level keys unchanged (version, activeUniverseId, universes, masterAtlas)');
} else fail('Critical', 'getSavePayload top-level shape changed');

if (!/getSavePayload[\s\S]{0,300}knowledge/.test(script)) {
  pass('Knowledge catalogue not written via getSavePayload');
} else fail('High', 'Knowledge may be persisted in save payload');

const knowledgeBlock = script.match(/const knowledgeData = \[([\s\S]*?)\];/);
const knowledgeCount = knowledgeBlock ? (knowledgeBlock[1].match(/id: '/g) || []).length : 0;
if (knowledgeCount >= 40) pass(`knowledgeData has ${knowledgeCount} entries (Pack 2+)`);
else fail('High', `Expected at least 40 knowledge entries, got ${knowledgeCount}`);

if (script.includes('routes: {}') && script.includes('function mergeSavedRoutes')) {
  pass('Route save slot (gameProgress.routes) with merge helper');
} else fail('High', 'Missing routes save integration');

const viewTabButtons = (html.match(/<button[^>]*id="view(?!TabsMore)\w+Btn"[^>]*class="view-tab/g) || []).length;
if (viewTabButtons === 13) pass('13 view tabs present (4 primary + 9 in More menu)');
else fail('High', `Expected 13 view tabs, got ${viewTabButtons}`);
if (html.includes('id="viewTabsMoreBtn"')) pass('View More menu button present');
else fail('High', 'Missing viewTabsMoreBtn');

['command', 'routes', 'knowledge'].forEach((view) => {
  if (script.includes(`view === '${view}'`)) pass(`setView handles '${view}'`);
  else fail('High', `setView missing branch for '${view}'`);
});

if (script.includes('getCommandCenterRecommendations') && script.includes('refreshCommandCenterIfVisible')) {
  pass('Command Center recommendation engine wired');
} else fail('High', 'Command Center helpers incomplete');

if (script.includes('dijkstraRouteSegment') && script.includes('setRoutePlannerMapHighlight')) {
  pass('Route Planner pathfinding and map highlight');
} else fail('High', 'Route Planner core helpers missing');

if (script.includes('getKnowledgeForSystem') && script.includes('systemDetailsKnowledge')) {
  pass('Knowledge system details integration');
} else fail('High', 'Knowledge system panel integration missing');

if (script.includes('appendLocationKnowledgeBlock')) {
  pass('Knowledge location drilldown integration');
} else fail('Medium', 'Knowledge location integration missing');

if (script.includes('openRoutePlannerForMission') && script.includes('Plan Route')) {
  pass('Mission Plan Route entry point');
} else fail('Medium', 'Mission Plan Route missing');

if (script.includes('syncMapFilterBarLayout') && script.includes('--route-filter-bar-top-offset')) {
  pass('Map filter bars stack when both visible');
} else fail('Medium', 'Missing stacked map filter bar layout sync');

if (script.includes('resourceMatch || routeMatch')) {
  pass('Resource and route highlights use union when both active');
} else fail('Medium', 'Resource/route highlight logic may still AND-combine');

// Pan ignore for new panels
['command-center-panel', 'route-planner-panel', 'knowledge-atlas-panel'].forEach((cls) => {
  if (script.includes(`.${cls}`)) pass(`Pan ignore: ${cls}`);
  else fail('Medium', `shouldIgnorePanStart may miss .${cls}`);
});

console.log('=== QA Phases 23–25 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}] ${i.msg}`));
process.exit(issues.filter((i) => i.severity === 'Critical' || i.severity === 'High').length ? 1 : 0);
