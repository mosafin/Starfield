/* QA checks for Phase 37 — Atlas Insights & Intelligence */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const phase37Markers = [
  'computeAtlasInsights',
  'getAtlasInsightsCached',
  'getAtlasInsightsCacheKey',
  'renderInsightsPanel',
  'isKnowledgeEntrySeen',
  'completionForecast',
  'explorationRanking',
  'knowledgeCoverage',
  'playerInsights',
  'atlasCatalogueVersion',
  'atlasInsightsCache',
  'refreshInsightsIfVisible'
];

phase37Markers.forEach((marker) => {
  if (script.includes(marker)) pass(`Insights marker present: ${marker}`);
  else fail('High', `Missing Insights marker: ${marker}`);
});

const uiIds = [
  'insightsPanel',
  'insightsContent',
  'viewInsightsBtn'
];
uiIds.forEach((id) => {
  if (html.includes(`id="${id}"`)) pass(`Insights UI present: ${id}`);
  else fail('High', `Missing Insights UI: ${id}`);
});

if (html.includes('.insights-panel')) pass('Insights panel CSS present');
else fail('High', 'Missing insights-panel styles');

if (script.includes("SECONDARY_VIEW_IDS") && script.includes("'insights'")) {
  pass('Insights registered as secondary view');
} else {
  fail('High', 'insights missing from SECONDARY_VIEW_IDS');
}

if (script.includes("setView('insights')") && script.includes("view === 'insights'")) {
  pass('Insights view wired in setView');
} else {
  fail('High', 'Insights view not wired in setView');
}

if (script.includes('.insights-panel') && script.includes('shouldIgnorePanStart')) {
  pass('Insights panel excluded from map pan');
} else {
  fail('Medium', 'Insights panel may not be excluded from map pan');
}

if (script.includes('getAtlasInsightsCached,') && script.includes('computeAtlasInsights,')) {
  pass('AtlasManager exposes insights API');
} else {
  fail('High', 'AtlasManager missing insights methods');
}

if (script.includes('completionForecast: insightsSnapshot.completionForecast')) {
  pass('getAtlasStatistics extended with insights fields');
} else {
  fail('High', 'getAtlasStatistics missing insights extensions');
}

if (script.includes('atlasCatalogueVersion += 1')) {
  pass('Catalogue version bumps invalidate insights cache');
} else {
  fail('High', 'Missing atlasCatalogueVersion invalidation');
}

if (script.includes('atlasInsightsCache = null') && script.includes('invalidateCommandCenterCache')) {
  pass('Save changes invalidate insights cache');
} else {
  fail('High', 'Save path does not invalidate insights cache');
}

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 37 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
