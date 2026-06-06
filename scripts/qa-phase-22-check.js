/* QA checks for Phase 22 (compact controls + UI clickability) */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

if (html.includes('id="mapControlsMoreBtn"') && html.includes('id="mapControlsMoreMenu"')) {
  pass('Compact More menu controls present');
} else fail('High', 'Missing More menu controls');

if (script.includes('function initMapControlsMoreMenu') && script.includes('function closeMapControlsMoreMenu')) {
  pass('More menu open/close helpers wired');
} else fail('High', 'Missing More menu helpers');

if (script.includes('function syncTopUiLayout') && script.includes('ResizeObserver')) {
  pass('Top UI layout sync with ResizeObserver');
} else fail('High', 'Missing syncTopUiLayout / ResizeObserver');

if (script.includes('function syncMapFilterBarLayout') && script.includes('--route-filter-bar-top-offset')) {
  pass('Route filter bar stacks below resource filter bar');
} else fail('Medium', 'Missing syncMapFilterBarLayout');

if (html.includes('system-details-header') && html.includes('position: sticky')) {
  pass('System details sticky header');
} else fail('Medium', 'Missing sticky system details header');

if (script.includes('--bottom-ui-reserve') && /var\(--bottom-ui-reserve, 88px\)/.test(html)) {
  pass('Mobile details panel uses dynamic bottom reserve');
} else fail('Medium', 'Mobile details panel may use hardcoded bottom spacing');

if (script.includes('getUILayoutReport') && script.includes('UI_LAYOUT_TARGETS')) {
  pass('getUILayoutReport dev diagnostics');
} else fail('High', 'Missing getUILayoutReport');

if (script.includes('mapControlsPrimary') && script.includes("classList.toggle('hidden', view !== 'systems')")) {
  pass('Zoom controls hidden off Star Systems tab');
} else fail('Medium', 'Zoom controls may stay active when map hidden');

if (script.includes("target.closest('.route-filter-bar')")) {
  pass('Pan ignore includes route filter bar');
} else fail('Low', 'shouldIgnorePanStart may miss route filter bar');

console.log('=== QA Phase 22 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}] ${i.msg}`));
process.exit(issues.filter((i) => i.severity === 'Critical' || i.severity === 'High').length ? 1 : 0);
