/* QA checks for Phase 40 — Version 1.0 Release Candidate */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

// Version metadata
if (script.includes("const ATLAS_APP_VERSION = '1.0.0'")) pass('ATLAS_APP_VERSION is 1.0.0');
else fail('Critical', 'Missing or incorrect ATLAS_APP_VERSION');

if (html.includes('Starfield Starmap Explorer 1.0.0')) pass('HTML generator meta documents v1.0.0');
else fail('High', 'Missing generator meta for v1.0.0');

if (script.includes('appVersion: ATLAS_APP_VERSION')) pass('AtlasManager exposes appVersion');
else fail('High', 'AtlasManager missing appVersion');

if (script.includes('appVersion: ATLAS_APP_VERSION') && script.includes('saveVersion: SAVE_VERSION')) {
  pass('getAtlasHealthReport includes appVersion and saveVersion');
} else fail('High', 'Health report missing version fields');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

// Accessibility RC markers
if (html.includes('prefers-reduced-motion')) pass('Reduced motion support present');
else fail('High', 'Missing prefers-reduced-motion rules');

if (html.includes('shortcutsHelpOverlay') && html.includes('role="dialog"')) pass('Shortcuts help dialog ARIA present');
else fail('High', 'Shortcuts help dialog missing ARIA');

// Release documentation
const requiredDocs = [
  'README.md',
  'CHANGELOG.md',
  'docs/Version-1.0-Architecture-Overview.md',
  'docs/Developer-Guide.md',
  'docs/known-issues.md',
  'docs/Installation-Guide.md',
  'docs/Backup-Restore-Guide.md',
  'docs/Browser-Compatibility.md',
  'docs/Future-Roadmap.md',
  'docs/release-notes/2026-06-28-version-1.0.0-rc.md'
];
requiredDocs.forEach((rel) => {
  if (fs.existsSync(path.join(root, rel))) pass(`Release doc present: ${rel}`);
  else fail('High', `Missing release doc: ${rel}`);
});

// Release package
const packageFiles = [
  'release/starfield-atlas-v1.0.0/VERSION.json',
  'release/starfield-atlas-v1.0.0/LICENSE',
  'release/starfield-atlas-v1.0.0/CREDITS.md',
  'release/starfield-atlas-v1.0.0/THIRD-PARTY-NOTICES.md',
  'release/starfield-atlas-v1.0.0/icon.svg',
  'release/starfield-atlas-v1.0.0/PACKAGE.md'
];
packageFiles.forEach((rel) => {
  if (fs.existsSync(path.join(root, rel))) pass(`Package file present: ${rel}`);
  else fail('High', `Missing package file: ${rel}`);
});

// Companion scripts
['qa-performance-baseline.js', 'qa-save-compatibility-check.js', 'run-full-regression.js'].forEach((name) => {
  if (fs.existsSync(path.join(__dirname, name))) pass(`Regression script present: ${name}`);
  else fail('High', `Missing regression script: ${name}`);
});

// No coordinate drift guard (Phase 9 spacing)
if (script.includes('applyClusterSpacing') || script.includes('CLUSTER_SPACING')) {
  pass('Cluster spacing helper still present');
} else if (script.includes('spacingOffset') || script.includes('manualOffset')) {
  pass('Manual spacing offsets still present');
} else {
  fail('Medium', 'Could not verify Phase 9 spacing markers');
}

console.log('=== QA Phase 40 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
