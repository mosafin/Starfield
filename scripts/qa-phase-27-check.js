/* QA checks for Phase 27 — Knowledge Atlas Expansion Pack 1 */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const PACK1_MIN_ENTRIES = 22;
const knowledgeBlock = script.match(/const knowledgeData = \[([\s\S]*?)\n        \];/);
const knowledgeSrc = knowledgeBlock ? knowledgeBlock[1] : '';
const knowledgeCount = (knowledgeSrc.match(/id: '/g) || []).length;

if (knowledgeCount >= PACK1_MIN_ENTRIES) {
  pass(`knowledgeData has ${knowledgeCount} entries (Pack 1 minimum ${PACK1_MIN_ENTRIES})`);
} else {
  fail('High', `Expected at least ${PACK1_MIN_ENTRIES} knowledge entries, got ${knowledgeCount}`);
}

const requiredIds = [
  'vendor_jemison_mercantile', 'vendor_uc_distribution', 'vendor_trade_authority_new_atlantis',
  'vendor_trade_authority_neon', 'vendor_siegharts_outfitters', 'vendor_newills_goods',
  'vendor_shepherds_general_store', 'vendor_trade_authority_the_den',
  'companion_vasco', 'home_neon_sleepcrate', 'magazine_new_atlantis_starter',
  'temple_catalogue_framework'
];
requiredIds.forEach((id) => {
  if (knowledgeSrc.includes(`id: '${id}'`)) pass(`Pack 1 entry present: ${id}`);
  else fail('High', `Missing Pack 1 entry: ${id}`);
});

if (!/getSavePayload[\s\S]{0,300}knowledge/.test(script)) {
  pass('Knowledge catalogue not written via getSavePayload');
} else fail('Critical', 'Knowledge may be persisted in save payload');

const systemsMatch = script.match(/const starSystemsData = \[([\s\S]*?)\n        \];/);
const systemIds = new Set();
if (systemsMatch) {
  [...systemsMatch[1].matchAll(/id: '([^']+)'/g)].forEach((m) => systemIds.add(m[1]));
}

const planetsMatch = script.match(/const planetData = \[([\s\S]*?)\n        \];/);
const planetIds = new Set();
if (planetsMatch) {
  [...planetsMatch[1].matchAll(/id: '([^']+)'/g)].forEach((m) => planetIds.add(m[1]));
}

const locationsMatch = script.match(/const locationData = \[([\s\S]*?)\n        \];/);
const locationIds = new Set();
if (locationsMatch) {
  [...locationsMatch[1].matchAll(/id: '([^']+)'/g)].forEach((m) => locationIds.add(m[1]));
}

const entryRegex = /\{\s*id: '([^']+)'[\s\S]*?systemId: ([^,]+),[\s\S]*?planetId: ([^,]+),[\s\S]*?locationId: ([^,]+),/g;
const seenIds = new Set();
let orphanSystems = 0;
let orphanPlanets = 0;
let orphanLocations = 0;
let duplicateIds = 0;
let match;
while ((match = entryRegex.exec(knowledgeSrc)) !== null) {
  const [, id, systemIdRaw, planetIdRaw, locationIdRaw] = match;
  if (seenIds.has(id)) duplicateIds += 1;
  else seenIds.add(id);

  const systemId = systemIdRaw.trim().replace(/^'|'$/g, '');
  const planetId = planetIdRaw.trim().replace(/^'|'$/g, '');
  const locationId = locationIdRaw.trim().replace(/^'|'$/g, '');

  if (systemId && systemId !== 'null' && !systemIds.has(systemId)) orphanSystems += 1;
  if (planetId && planetId !== 'null' && !planetIds.has(planetId)) orphanPlanets += 1;
  if (locationId && locationId !== 'null' && !locationIds.has(locationId)) orphanLocations += 1;
}

if (duplicateIds === 0) pass('No duplicate knowledge ids');
else fail('Critical', `Duplicate knowledge ids: ${duplicateIds}`);

if (orphanSystems === 0) pass('No orphan knowledge systemId refs');
else fail('Critical', `Orphan knowledge system refs: ${orphanSystems}`);

if (orphanPlanets === 0) pass('No orphan knowledge planetId refs');
else fail('High', `Orphan knowledge planet refs: ${orphanPlanets}`);

if (orphanLocations === 0) pass('No orphan knowledge locationId refs');
else fail('High', `Orphan knowledge location refs: ${orphanLocations}`);

if (script.includes('Show on Map unavailable')) pass('Null systemId Show on Map message');
else fail('Medium', 'Missing Show on Map unavailable handling');

if (knowledgeSrc.includes("planetId: 'volii_alpha'") && knowledgeSrc.includes("locationId: 'neon_city'")) {
  pass('Neon entries use volii_alpha to match locationData');
} else fail('Medium', 'Neon planet/location linkage may be inconsistent');

['vendor', 'companion', 'player_home', 'magazine', 'power', 'temple'].forEach((type) => {
  if (knowledgeSrc.includes(`type: '${type}'`)) pass(`Knowledge type represented: ${type}`);
  else fail('High', `Missing knowledge type: ${type}`);
});

console.log('=== QA Phase 27 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}] ${i.msg}`));
process.exit(issues.filter((i) => i.severity === 'Critical' || i.severity === 'High').length ? 1 : 0);
