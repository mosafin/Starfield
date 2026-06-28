/* QA checks for Phase 30 — Knowledge Atlas Expansion Pack 2 */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const PACK2_MIN_ENTRIES = 40;
const knowledgeBlock = script.match(/const knowledgeData = \[([\s\S]*?)\n        \];/);
const knowledgeSrc = knowledgeBlock ? knowledgeBlock[1] : '';
const knowledgeCount = (knowledgeSrc.match(/id: '/g) || []).length;

if (knowledgeCount >= PACK2_MIN_ENTRIES) {
  pass(`knowledgeData has ${knowledgeCount} entries (Pack 2 minimum ${PACK2_MIN_ENTRIES})`);
} else {
  fail('High', `Expected at least ${PACK2_MIN_ENTRIES} knowledge entries, got ${knowledgeCount}`);
}

const pack2Types = [
  'ship_vendor', 'ship_manufacturer', 'ship_services', 'station', 'landmark',
  'unique_armour', 'medical', 'crew'
];
pack2Types.forEach((type) => {
  if (knowledgeSrc.includes(`type: '${type}'`)) pass(`Pack 2 type present: ${type}`);
  else fail('High', `Missing Pack 2 type: ${type}`);
});

const pack2Ids = [
  'ship_vendor_deimos_staryard', 'ship_manufacturer_stroud_eklund', 'station_the_key',
  'medical_the_clinic', 'trainer_uc_mast', 'magazine_mast_district', 'unique_weapon_mantis',
  'landmark_the_eye', 'crew_constellation_lodge'
];
pack2Ids.forEach((id) => {
  if (knowledgeSrc.includes(`id: '${id}'`)) pass(`Pack 2 entry present: ${id}`);
  else fail('High', `Missing Pack 2 entry: ${id}`);
});

[
  'openKnowledgeDetailPanel', 'renderKnowledgeDetailPanel', 'getRelatedKnowledgeEntries',
  'getKnowledgeSearchHaystack', 'getKnowledgeLinkedMissions', 'closeKnowledgeDetailPanel'
].forEach((fn) => {
  if (script.includes(`function ${fn}(`)) pass(`Function present: ${fn}`);
  else fail('High', `Missing function: ${fn}`);
});

if (html.includes('id="knowledgeDetailPanel"')) pass('Knowledge detail panel DOM present');
else fail('Critical', 'Knowledge detail panel missing');

if (script.includes('relatedEntryIds')) pass('Related entry links supported');
else fail('High', 'relatedEntryIds not used');

if (script.includes('getKnowledgeSearchHaystack')) pass('Enhanced search haystack present');
else fail('High', 'Search haystack helper missing');

if (script.includes("ships: Object.freeze(['ship_vendor'")) pass('Ships category filter defined');
else fail('High', 'Ships category filter missing');

if (script.includes("target.closest('.knowledge-detail-panel')")) {
  pass('Pan ignore includes knowledge detail panel');
} else fail('High', 'Knowledge detail not in pan ignore list');

if (!/getSavePayload[\s\S]{0,500}knowledgeData/.test(script)) {
  pass('Knowledge catalogue not written via getSavePayload');
} else fail('Critical', 'Knowledge may be persisted in save');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 30 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
