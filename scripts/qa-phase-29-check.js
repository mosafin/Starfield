/* QA checks for Phase 29 — Interactive Galaxy Timeline */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

const issues = [];
const passes = [];
function pass(msg) { passes.push(msg); }
function fail(sev, msg) { issues.push({ severity: sev, msg }); }

if (html.includes('id="timelinePanel"') && html.includes('id="viewTimelineBtn"')) {
  pass('Timeline panel and More menu button present');
} else fail('Critical', 'Timeline panel or view button missing');

if (script.includes("'timeline'") && script.includes('SECONDARY_VIEW_IDS')) {
  pass('Timeline in secondary view ids');
} else fail('High', 'Timeline not registered as secondary view');

[
  'buildTimelineEventsFromSave',
  'getTimelineEventsCached',
  'renderTimelinePanel',
  'computeTimelineMilestones',
  'invalidateTimelineCache',
  'openMissionFromTimeline',
  'getTimelineGroupId'
].forEach((fn) => {
  if (script.includes(`function ${fn}(`)) pass(`Function present: ${fn}`);
  else fail('High', `Missing function: ${fn}`);
});

const eventTypes = [
  'mission_completed', 'mission_started', 'planet_survey_completed',
  'location_completed', 'discovery_added', 'outpost_planned',
  'system_first_visited', 'system_fully_completed', 'knowledge_unlocked', 'universe_entered'
];
eventTypes.forEach((type) => {
  if (script.includes(`'${type}'`)) pass(`Event type supported: ${type}`);
  else fail('High', `Missing event type: ${type}`);
});

if (script.includes('timelineEventsCache') && script.includes('timelineDataVersion')) {
  pass('Timeline event cache present');
} else fail('High', 'Timeline cache missing');

if (script.includes('TIMELINE_GROUP_LABELS') && script.includes('Earlier')) {
  pass('Timeline date grouping present');
} else fail('Medium', 'Timeline grouping labels missing');

if (script.includes('data-timeline-filter')) {
  pass('Timeline category filters in UI');
} else fail('High', 'Timeline filters missing');

if (script.includes('openMissionFromTimeline')) {
  pass('Open Mission integration present');
} else fail('High', 'Open Mission action missing');

if (script.includes('exploredAt')) {
  pass('System exploredAt timestamp hook');
} else fail('High', 'exploredAt timestamp missing');

if (script.includes('startedAt')) {
  pass('Mission startedAt timestamp hook');
} else fail('High', 'startedAt timestamp missing');

if (script.includes("target.closest('.timeline-panel')")) {
  pass('Pan ignore includes timeline panel');
} else fail('High', 'Timeline panel not in pan ignore list');

if (!/getSavePayload[\s\S]{0,500}timelineEvents/.test(script)) {
  pass('Timeline events not persisted as separate save blob');
} else fail('Critical', 'Timeline may be duplicated in save payload');

const saveVersionMatch = script.match(/const SAVE_VERSION = (\d+)/);
if (saveVersionMatch && saveVersionMatch[1] === '2') {
  pass('Save version still v2');
} else fail('Critical', 'SAVE_VERSION changed unexpectedly');

if (!/version:\s*SAVE_VERSION[\s\S]{0,120}activeUniverseId[\s\S]{0,120}universes[\s\S]{0,120}masterAtlas/.test(script)) {
  pass('Save v2 top-level keys unchanged in getSavePayload');
} else {
  const payloadMatch = script.match(/function getSavePayload\(\)[\s\S]{0,400}/);
  if (payloadMatch && !payloadMatch[0].includes('timeline')) pass('getSavePayload has no timeline top-level key');
  else fail('Critical', 'getSavePayload may have new top-level keys');
}

console.log('=== QA Phase 29 Check ===');
console.log('Passes:', passes.length);
passes.forEach((p) => console.log('  OK:', p));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(`  [${i.severity}]`, i.msg));
process.exit(issues.some((i) => i.severity === 'Critical' || i.severity === 'High') ? 1 : 0);
