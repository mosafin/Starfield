/* QA checks for Phase 34 — Mission Atlas 2.0 */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

const missionCount = (script.match(/const missionData = \[([\s\S]*?)\n        \];/)[1].match(/id: '/g) || []).length;

if (missionCount >= 122) pass(`missionData has ${missionCount} entries`);
else fail('High', `Expected at least 122 missions, got ${missionCount}`);

const phase34Markers = [
  'MISSION_GROUP_TO_CATEGORY',
  'MISSION_CATEGORY_ORDER',
  'enrichMissionAtlasMetadata',
  'buildMissionAtlasDetailHtml',
  'getMissionSearchHaystack',
  'computeMissionAtlasCoverage',
  'missionsByPrimaryLocationId',
  'locationsByMissionId',
  'knowledgeByMissionId',
  'missionAtlasCoverage',
  'missionsMissingLocations',
  'missionsMissingRewards'
];

phase34Markers.forEach((marker) => {
  if (script.includes(marker)) pass(`Mission Atlas marker present: ${marker}`);
  else fail('High', `Missing Mission Atlas marker: ${marker}`);
});

const filterIds = [
  'missionCategoryFilter',
  'missionFactionFilter',
  'missionLevelFilter',
  'missionNotStartedOnly',
  'missionHasChoicesFilter',
  'missionHasRewardsFilter'
];
filterIds.forEach((id) => {
  if (html.includes(`id="${id}"`)) pass(`Mission filter UI present: ${id}`);
  else fail('High', `Missing mission filter UI: ${id}`);
});

if (html.includes('.mission-atlas-detail')) pass('Mission atlas detail CSS present');
else fail('High', 'Missing mission-atlas-detail styles');

if (script.includes('openTimelineForMission')) pass('Timeline cross-link helper present');
else fail('High', 'Missing openTimelineForMission');

if (script.includes('openKnowledgeForMission')) pass('Knowledge cross-link helper present');
else fail('High', 'Missing openKnowledgeForMission');

if (script.includes('wireMissionAtlasDetailLinks')) pass('Mission detail link wiring present');
else fail('High', 'Missing wireMissionAtlasDetailLinks');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') pass('Save version still v2');
else fail('Critical', 'SAVE_VERSION changed');

console.log('=== QA Phase 34 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
