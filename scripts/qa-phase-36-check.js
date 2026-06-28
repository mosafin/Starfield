/* QA checks for Phase 36 — Fleet & Crew Manager */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const phase36Markers = [
  'ensureFleetProgressStructure',
  'rebuildFleetIndexes',
  'getFleetStatistics',
  'getFleetShips',
  'getCrewMembers',
  'getOwnedHomes',
  'mergeFleetProgress',
  'renderFleetPanel',
  'openFleetManager',
  'HOME_TYPE_LABELS',
  'CREW_ROLE_TYPE_LABELS',
  'ship_added',
  'crew_assigned',
  'home_purchased',
  'crew_reassigned',
  'playerFleet'
];

phase36Markers.forEach((marker) => {
  if (script.includes(marker)) pass(`Fleet marker present: ${marker}`);
  else fail('High', `Missing Fleet marker: ${marker}`);
});

const uiIds = [
  'fleetPanel',
  'viewFleetBtn',
  'fleetSearchInput',
  'fleetAddShipBtn',
  'fleetAddCrewBtn',
  'fleetAddHomeBtn'
];
uiIds.forEach((id) => {
  if (html.includes(`id="${id}"`)) pass(`Fleet UI present: ${id}`);
  else fail('High', `Missing Fleet UI: ${id}`);
});

if (html.includes('.fleet-panel')) pass('Fleet panel CSS present');
else fail('High', 'Missing fleet-panel styles');

if (script.includes("fleet: { ships: {} }") && script.includes("crew: { members: {} }")) {
  pass('Default universe includes fleet/crew/homes slots');
} else {
  fail('High', 'createEmptyUniverse missing fleet/crew/homes defaults');
}

if (script.includes('mergeFleetProgress')) pass('Fleet merge on load present');
else fail('High', 'Missing mergeFleetProgress');

if (script.includes("type: 'ship'") && script.includes("type: 'crew'") && script.includes("type: 'home'")) {
  pass('Galactic search includes fleet types');
} else {
  fail('High', 'Galactic search missing fleet/crew/home types');
}

if (script.includes('rebuildFleetIndexes,')) pass('AtlasManager exposes rebuildFleetIndexes');
else fail('High', 'AtlasManager missing rebuildFleetIndexes');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 36 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
