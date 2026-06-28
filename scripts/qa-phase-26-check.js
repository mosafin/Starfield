/* QA checks for Phase 26 (Atlas Polish Release 1) */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

// View navigation: primary tabs + More menu
const primaryTabs = ['viewSystemsBtn', 'viewMissionsBtn', 'viewProgressBtn', 'viewCommandBtn'];
primaryTabs.forEach((id) => {
  if (html.includes(`id="${id}"`)) pass(`Primary tab: ${id}`);
  else fail('High', `Missing primary tab ${id}`);
});

const secondaryTabs = ['viewResourcesBtn', 'viewOutpostsBtn', 'viewDiscoveriesBtn', 'viewUniversesBtn', 'viewRouteBtn', 'viewKnowledgeBtn'];
secondaryTabs.forEach((id) => {
  if (html.includes(`id="${id}"`) && html.includes('viewTabsMoreMenu')) pass(`Secondary tab in More menu: ${id}`);
  else fail('High', `Secondary tab ${id} not in More menu`);
});

if (html.includes('id="viewTabsMoreBtn"') && script.includes('initViewTabsMoreMenu') && script.includes('syncViewSwitcherUi')) {
  pass('View tabs More menu wired');
} else fail('High', 'Missing view tabs More menu helpers');

if (script.includes('SECONDARY_VIEW_IDS') && script.includes('VIEW_TAB_LABELS')) {
  pass('View label maps defined');
} else fail('Medium', 'Missing SECONDARY_VIEW_IDS / VIEW_TAB_LABELS');

// Performance helpers
if (script.includes('systemById') && script.includes('systemById[element.dataset.id]')) {
  pass('systemById index used in map visual state');
} else fail('Medium', 'systemById map lookup missing');

if (script.includes('invalidateCommandCenterCache') && script.includes('commandCenterRecommendationsCache')) {
  pass('Command Center recommendation cache');
} else fail('Medium', 'Command Center cache missing');

if (script.includes('routePlannerPathCacheKey')) {
  pass('Route planner path cache key');
} else fail('Low', 'Route planner path cache missing');

if (script.includes('knowledgeFilteredCache')) {
  pass('Knowledge filter result cache');
} else fail('Low', 'Knowledge filter cache missing');

// Catalogue readiness report
if (script.includes('function getAtlasDataReadinessReport') && script.includes('readyForExpansion')) {
  pass('getAtlasDataReadinessReport dev report');
} else fail('High', 'Missing getAtlasDataReadinessReport');

// Knowledge polish
if (html.includes('id="knowledgeClearFiltersBtn"') && script.includes('clearKnowledgeFilters')) {
  pass('Knowledge clear filters control');
} else fail('Medium', 'Knowledge clear filters missing');

if (html.includes('id="knowledgeStarterHint"')) {
  pass('Knowledge starter hint');
} else fail('Low', 'Knowledge starter hint missing');

// Layout / pan ignore
if (script.includes("target.closest('.view-tabs-more-menu')")) {
  pass('Pan ignore: view-tabs-more-menu');
} else fail('Medium', 'shouldIgnorePanStart may miss view-tabs-more-menu');

console.log('=== QA Phase 26 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}] ${i.msg}`));
process.exit(issues.filter((i) => i.severity === 'Critical' || i.severity === 'High').length ? 1 : 0);
