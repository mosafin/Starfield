/* QA checks for Phase 38 — Shattered Space Integration Framework */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const phase38Markers = [
  'atlasPack_shatteredSpace',
  'buildAtlasPack_shatteredSpace',
  'loadAtlasPack',
  'unloadAtlasPack',
  'bootstrapAtlasPacks',
  'validateAtlasPackContent',
  'validateRegisteredAtlasPacks',
  'mergeAtlasPackCatalogues',
  'ATLAS_PACK_MANIFEST',
  'getAtlasPackStatusList',
  'getDlcCatalogueSummary',
  'renderAtlasPackDevPanel',
  'finalizeCataloguePackChange'
];

phase38Markers.forEach((marker) => {
  if (script.includes(marker)) pass(`Pack framework marker: ${marker}`);
  else fail('High', `Missing pack framework marker: ${marker}`);
});

if (script.includes("id: 'shattered-space'") && script.includes('requiredAtlasVersion')) {
  pass('Shattered Space pack metadata present');
} else {
  fail('High', 'Missing Shattered Space pack metadata');
}

if (script.includes('loadAtlasPack(\'shattered-space\'')) {
  pass('Shattered Space auto-bootstrap present');
} else {
  fail('High', 'Missing shattered-space bootstrap load');
}

if (script.includes('reason: \'not_implemented\'')) {
  fail('High', 'loadAtlasPack still returns not_implemented stub');
} else {
  pass('loadAtlasPack stub removed');
}

if (script.includes('loadedPacks: getAtlasPackStatusList()')) {
  pass('getAtlasStatistics includes loadedPacks');
} else {
  fail('High', 'getAtlasStatistics missing loadedPacks');
}

if (script.includes('dlc: getDlcCatalogueSummary()')) {
  pass('getAtlasStatistics includes dlc summary');
} else {
  fail('High', 'getAtlasStatistics missing dlc summary');
}

if (html.includes('id="atlasPackDevBlock"') && html.includes('id="atlasPackDevList"')) {
  pass('Loaded Packs dev UI present');
} else {
  fail('High', 'Missing Loaded Packs dev UI');
}

if (script.includes('unloadAtlasPack,') && script.includes('getAtlasPackStatusList,')) {
  pass('AtlasManager exposes pack load API');
} else {
  fail('High', 'AtlasManager missing pack methods');
}

if (script.includes('packValidation') && script.includes('validateRegisteredAtlasPacks')) {
  pass('validateAtlas extended for pack validation');
} else {
  fail('High', 'validateAtlas missing pack validation');
}

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 38 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
