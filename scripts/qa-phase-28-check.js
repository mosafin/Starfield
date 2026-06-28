/* QA checks for Phase 28 — Compare & Planning Mode */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

if (html.includes('id="compareModePanel"') && html.includes('id="compareTray"')) {
  pass('Compare panel and tray DOM present');
} else fail('Critical', 'Compare panel or tray DOM missing');

if (html.includes('id="systemDetailsCompareBtn"')) {
  pass('System Details Compare button present');
} else fail('High', 'System Details Compare button missing');

if (script.includes('const compareModeState')) {
  pass('Runtime compareModeState defined');
} else fail('Critical', 'compareModeState missing');

if (script.includes('COMPARE_MAX_SYSTEMS = 4')) {
  pass('Max four systems enforced');
} else fail('High', 'COMPARE_MAX_SYSTEMS not set to 4');

[
  'addSystemToCompare',
  'removeSystemFromCompare',
  'clearCompareList',
  'renderComparePanel',
  'computeSystemPlanningScores',
  'analyzeCompareResources',
  'getSystemCompareSnapshot',
  'createAddToCompareButton'
].forEach((fn) => {
  if (script.includes(`function ${fn}(`)) pass(`Function present: ${fn}`);
  else fail('High', `Missing function: ${fn}`);
});

if (script.includes('is already in the comparison list')) {
  pass('Duplicate prevention message present');
} else fail('High', 'Duplicate compare prevention missing');

if (script.includes('You can compare up to')) {
  pass('Max-four message present');
} else fail('High', 'Max-four compare guard missing');

if (script.includes('function computeSystemPlanningScores')) {
  pass('Planning score function present');
} else fail('High', 'Planning score function missing');

if (script.includes('Resource Comparison')) {
  pass('Resource comparison section label present');
} else fail('Medium', 'Resource comparison UI label missing');

if (script.includes('createAddToCompareButton(entry.systemId)')) {
  pass('Knowledge Atlas Compare integration');
} else fail('High', 'Knowledge Atlas Compare button missing');

if (script.includes('createAddToCompareButton(group.systemId)')) {
  pass('Resource Atlas Compare integration');
} else fail('High', 'Resource Atlas Compare button missing');

if (script.includes('createAddToCompareButton(systemId, `Compare ${getSystemNameById(systemId)}`)')) {
  pass('Route Planner Compare integration');
} else fail('High', 'Route Planner Compare buttons missing');

if (script.includes("target.closest('.compare-mode-panel')")) {
  pass('Pan ignore includes compare panel');
} else fail('High', 'Compare panel not in pan ignore list');

if (!/getSavePayload[\s\S]{0,400}compareMode/.test(script)) {
  pass('Compare state not written via getSavePayload');
} else fail('Critical', 'Compare state may be persisted in save');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') {
  pass('Save version still v2');
} else fail('Critical', 'SAVE_VERSION changed unexpectedly');

if (script.includes('function getSystemResourceNames(systemId)')) {
  pass('Resource lookup uses catalogue indexes');
} else fail('Medium', 'getSystemResourceNames helper missing');

console.log('=== QA Phase 28 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
