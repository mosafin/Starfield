/* QA checks for Phase 33 — Location Atlas Expansion Pack 1 */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const locationBlock = script.match(/const locationData = \[([\s\S]*?)\n        \];/)[1];
const locationIds = [...locationBlock.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
const locationCount = locationIds.length;
const locationDupes = locationIds.filter((id, i) => locationIds.indexOf(id) !== i);

if (locationCount >= 62) pass(`locationData has ${locationCount} entries (Phase 33 minimum 62)`);
else fail('High', `Expected at least 62 locations, got ${locationCount}`);

if (locationDupes.length === 0) pass('No duplicate location IDs');
else fail('Critical', `Duplicate location IDs: ${[...new Set(locationDupes)].join(', ')}`);

const phase33Locations = [
  'the_scow', 'apollo_landing_site', 'london_landmark', 'siren_of_stars', 'codos',
  'freestar_rangers_hq', 'neon_medical_center', 'cydonia_military_district',
  'kryx_fleet_administration', 'mercury_tower'
];
phase33Locations.forEach((id) => {
  if (locationBlock.includes(`id: '${id}'`)) pass(`Phase 33 location present: ${id}`);
  else fail('High', `Missing Phase 33 location: ${id}`);
});

const phase33Types = ['district', 'mine', 'lab', 'military', 'hospital', 'factory', 'quest'];
phase33Types.forEach((type) => {
  if (script.includes(`${type}: '`)) pass(`Location type label present: ${type}`);
  else fail('High', `Missing location type: ${type}`);
});

if (script.includes("locationId: 'neon_medical_center'")) pass('Medical knowledge linked to neon_medical_center');
else fail('High', 'medical_neon not linked to neon_medical_center');

if (script.includes("locationId: 'freestar_rangers_hq'")) pass('Trainer knowledge linked to freestar_rangers_hq');
else fail('High', 'trainer_freestar_akila not linked to freestar_rangers_hq');

if (script.includes('coverageByCategory')) pass('getAtlasStatistics coverageByCategory present');
else fail('High', 'Missing coverageByCategory in getAtlasStatistics');

if (script.includes('locationsPerSystem')) pass('getAtlasStatistics locationsPerSystem present');
else fail('High', 'Missing locationsPerSystem in getAtlasStatistics');

if (script.includes('systemsWithNoNamedLocations')) pass('getExpansionReadiness location gap metrics present');
else fail('High', 'Missing systemsWithNoNamedLocations in getExpansionReadiness');

if (script.includes('largestLocationGaps')) pass('getExpansionReadiness largestLocationGaps present');
else fail('High', 'Missing largestLocationGaps in getExpansionReadiness');

if (script.includes("relatedMissionIds: ['the_best_there_is', 'echoes_of_the_past', 'breaking_the_bank']")) {
  pass('The Lock has expanded mission links');
} else fail('High', 'The Lock missing Phase 33 mission cross-links');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 33 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
