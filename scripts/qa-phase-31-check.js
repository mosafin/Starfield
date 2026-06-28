/* QA checks for Phase 31 — Atlas Data Manager & Expansion Framework */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

[
  'atlasRegistry',
  'atlasIndexes',
  'atlasPackSlots',
  'AtlasManager',
  'validateAtlas',
  'getAtlasStatistics',
  'getExpansionReadiness',
  'rebuildAtlasIndexes',
  'measureAtlasPerformance',
  'registerAtlasPack',
  'loadAtlasPack',
  'syncAtlasIndexAliases',
  'validateSystemsData',
  'validateMissionData'
].forEach((symbol) => {
  if (script.includes(symbol)) pass(`Symbol present: ${symbol}`);
  else fail('High', `Missing symbol: ${symbol}`);
});

if (script.includes('missionsBySystemId')) pass('missionsBySystemId index present');
else fail('High', 'Missing missionsBySystemId index');

if (/function buildCatalogueIndexes\(\)[\s\S]{0,120}return rebuildAtlasIndexes\(\)/.test(script)) {
  pass('buildCatalogueIndexes delegates to rebuildAtlasIndexes');
} else if (script.includes('function buildCatalogueIndexes()') && script.includes('function rebuildAtlasIndexes()')) {
  pass('buildCatalogueIndexes and rebuildAtlasIndexes both defined');
} else {
  fail('High', 'Index rebuild entry point missing');
}

if (script.includes('window.AtlasManager = AtlasManager')) pass('AtlasManager exposed on window');
else fail('High', 'AtlasManager not exposed');

if (script.includes('knowledge: Object.freeze({') && script.includes("packId: 'knowledge'")) {
  pass('Knowledge pack slot in registry');
} else fail('High', 'Knowledge pack slot missing');

if (script.includes("'shattered-space'") && script.includes('Shattered Space')) {
  pass('Shattered Space DLC pack slot present');
} else if (script.includes("id: 'dlc'") && script.includes("loaded: false")) {
  pass('DLC pack slot reserved');
} else {
  fail('High', 'DLC pack slot missing');
}

if (script.includes('coverage') && script.includes('systemsWithPlanets')) {
  pass('getAtlasStatistics coverage fields present');
} else fail('High', 'Atlas statistics coverage missing');

if (script.includes('largestUncataloguedSystems')) pass('getExpansionReadiness gap analysis present');
else fail('High', 'Expansion readiness report missing');

if (script.includes('indexRebuildMs') && script.includes('validationMs')) {
  pass('Performance benchmarks present');
} else fail('High', 'Performance benchmarks missing');

if (script.includes('return missionsBySystemId[systemId]')) {
  pass('getLinkedMissionsForSystem uses index');
} else fail('Medium', 'getLinkedMissionsForSystem may still scan missionData');

if (!/getSavePayload[\s\S]{0,800}atlasRegistry/.test(script)) {
  pass('Atlas registry not written via getSavePayload');
} else fail('Critical', 'Atlas registry may be persisted in save');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 31 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
