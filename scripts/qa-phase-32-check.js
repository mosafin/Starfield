/* QA checks for Phase 32 — Core Atlas planet & location expansion */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const planetBlock = script.match(/const planetData = \[([\s\S]*?)\n        \];/)[1];
const locationBlock = script.match(/const locationData = \[([\s\S]*?)\n        \];/)[1];
const sysBlock = script.match(/const starSystemsData = \[([\s\S]*?)\n        \];/)[1];

const planetIds = [...planetBlock.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
const planetCount = planetIds.length;
const locationCount = (locationBlock.match(/id: '/g) || []).length;
const systemCount = (sysBlock.match(/id: '/g) || []).length;
const systemsWithPlanets = new Set([...planetBlock.matchAll(/systemId: '([^']+)'/g)].map((m) => m[1])).size;

const planetDupes = planetIds.filter((id, i) => planetIds.indexOf(id) !== i);
if (planetCount >= 550) pass(`planetData has ${planetCount} entries (Phase 32 minimum 550)`);
else fail('High', `Expected at least 550 planets, got ${planetCount}`);

if (locationCount >= 50) pass(`locationData has ${locationCount} entries (Phase 32 minimum 50)`);
else fail('High', `Expected at least 50 locations, got ${locationCount}`);

if (systemsWithPlanets >= systemCount) {
  pass(`All ${systemCount} star systems have catalogue planets (${systemsWithPlanets})`);
} else {
  fail('High', `Only ${systemsWithPlanets}/${systemCount} systems have planets`);
}

if (planetDupes.length === 0) pass('No duplicate planet IDs');
else fail('Critical', `Duplicate planet IDs: ${planetDupes.join(', ')}`);

const phase32Locations = [
  'argos_extractors_outpost', 'unity_temple_masada', 'procyon_a_temple', 'hamadi_station',
  'tomb_of_the_fang', 'the_lock', 'sanctum_universum'
];
phase32Locations.forEach((id) => {
  if (locationBlock.includes(`id: '${id}'`)) pass(`Phase 32 location present: ${id}`);
  else fail('High', `Missing Phase 32 location: ${id}`);
});

if (script.includes("locationId: 'argos_extractors_outpost'")) {
  pass('Companion knowledge linked to Vectera outpost');
} else fail('High', 'Barrett/Vasco not linked to argos_extractors_outpost');

if (script.includes('function getAtlasCompletenessReport(')) pass('getAtlasCompletenessReport present');
else fail('High', 'Missing getAtlasCompletenessReport');

if (script.includes('vanillaAtlasProgress')) pass('vanillaAtlasProgress coverage metrics present');
else fail('High', 'Missing vanillaAtlasProgress in statistics');

if (script.includes('getAtlasCompletenessReport') && script.includes('AtlasManager')) {
  pass('AtlasManager exposes completeness report');
} else fail('High', 'AtlasManager missing completeness report');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 32 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
