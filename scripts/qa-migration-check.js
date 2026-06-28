/* Save migration unit tests (Node, no browser) */
const fs = require('fs');
const path = require('path');

// Minimal simulation of migration logic extracted from app patterns
const UNIVERSE_IDS = ['universe_1', 'universe_2', 'universe_3', 'universe_4'];
const DISCOVERY_JOURNAL_KEY = '__discoveryJournal__';

function createEmptyUniverse(name) {
  return { name, systems: {}, missions: {}, planets: {}, locations: {}, routes: {}, milestones: { unityEntered: false, ngPlusLevel: 0, notes: '' } };
}
function getDefaultMasterAtlas() {
  return { systemsVisited: {}, planetsSurveyed: {}, locationsDiscovered: {}, discoveryIds: {}, totalDiscoveries: 0 };
}

function isUniverseSaveFormat(data) {
  return !!(data && data.universes && typeof data.universes === 'object');
}
function isOldSystemStatesFormat(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.universes !== undefined || data.masterAtlas !== undefined) return false;
  if (data.systems !== undefined || data.missions !== undefined) return false;
  return Object.keys(data).some(k => data[k] && typeof data[k] === 'object' && ('explored' in data[k] || 'scanned' in data[k]));
}
function normalizeLegacyEnvelope(data) {
  if (!data || typeof data !== 'object') return null;
  if (isOldSystemStatesFormat(data)) return { systems: data, missions: {}, planets: {}, locations: {} };
  if (isUniverseSaveFormat(data)) return null;
  return {
    systems: data.systems || {},
    missions: data.missions || {},
    planets: data.planets || {},
    locations: data.locations || {}
  };
}

let saveRoot = {
  version: 2,
  activeUniverseId: 'universe_1',
  universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])),
  masterAtlas: getDefaultMasterAtlas()
};

function migrateSaveToUniverseFormat(data) {
  if (!data || typeof data !== 'object') return false;
  if (isUniverseSaveFormat(data)) {
    saveRoot.version = data.version || 2;
    saveRoot.activeUniverseId = UNIVERSE_IDS.includes(data.activeUniverseId) ? data.activeUniverseId : 'universe_1';
    UNIVERSE_IDS.forEach((id, index) => {
      saveRoot.universes[id] = createEmptyUniverse(`Universe ${index + 1}`);
      if (data.universes[id]) {
        saveRoot.universes[id] = { ...saveRoot.universes[id], ...data.universes[id] };
      }
    });
    saveRoot.masterAtlas = { ...getDefaultMasterAtlas(), ...(data.masterAtlas || {}) };
    return true;
  }
  const legacy = normalizeLegacyEnvelope(data);
  if (!legacy) return false;
  saveRoot.universes.universe_1 = { ...createEmptyUniverse('Universe 1'), ...legacy };
  UNIVERSE_IDS.forEach((id, index) => {
    if (id !== 'universe_1') saveRoot.universes[id] = createEmptyUniverse(`Universe ${index + 1}`);
  });
  saveRoot.activeUniverseId = 'universe_1';
  return true;
}

let ok = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { ok++; console.log('  OK:', msg); }
  else { fail++; console.log('  FAIL:', msg); }
}

console.log('Legacy flat system save → Universe 1');
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({ narion: { explored: true, scanned: false, note: 'test' } });
assert(saveRoot.universes.universe_1.systems.narion?.explored === true, 'narion explored in universe_1');
assert(Object.keys(saveRoot.universes.universe_2.systems).length === 0, 'universe_2 still empty');

console.log('Legacy envelope → Universe 1');
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({
  systems: { sol: { explored: true, scanned: true, note: '' } },
  missions: { one_small_step: { status: 'completed', note: '', completedAt: '2026-01-01' } },
  planets: {},
  locations: { [DISCOVERY_JOURNAL_KEY]: { entries: [{ id: 'd1', title: 'Test' }] } }
});
assert(saveRoot.universes.universe_1.systems.sol?.explored === true, 'sol in migrated envelope');
assert(saveRoot.universes.universe_1.missions.one_small_step?.status === 'completed', 'mission preserved');
assert(saveRoot.universes.universe_1.locations[DISCOVERY_JOURNAL_KEY]?.entries?.length === 1, 'discovery journal preserved');

console.log('v2 round-trip');
const payload = JSON.parse(JSON.stringify(saveRoot));
payload.universes.universe_1.routes = {
  r1: { id: 'r1', name: 'Alpha run', stops: ['sol', 'alpha_centauri'], pathSystemIds: ['sol', 'alpha_centauri'], savedAt: '2026-06-06' }
};
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat(payload);
assert(saveRoot.universes.universe_1.missions.one_small_step?.status === 'completed', 'v2 reload keeps mission');
assert(saveRoot.universes.universe_1.routes?.r1?.name === 'Alpha run', 'v2 reload keeps routes');

console.log('Partial v2 import clears stale universe slots');
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
saveRoot.universes.universe_2.systems = { altair: { explored: true, scanned: false, note: 'stale' } };
migrateSaveToUniverseFormat({
  version: 2,
  activeUniverseId: 'universe_1',
  universes: { universe_1: { systems: { sol: { explored: true, scanned: false, note: '' } }, missions: {}, planets: {}, locations: {} } },
  masterAtlas: getDefaultMasterAtlas()
});
assert(saveRoot.universes.universe_1.systems.sol?.explored === true, 'universe_1 imported');
assert(Object.keys(saveRoot.universes.universe_2.systems).length === 0, 'universe_2 stale data cleared');

console.log('masterAtlas preserved on v2 round-trip');
const masterPayload = {
  version: 2,
  activeUniverseId: 'universe_1',
  universes: { universe_1: createEmptyUniverse('Universe 1') },
  masterAtlas: { systemsVisited: { sol: true }, planetsSurveyed: {}, locationsDiscovered: {}, discoveryIds: { d1: true }, totalDiscoveries: 3 }
};
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat(masterPayload);
assert(saveRoot.masterAtlas.systemsVisited?.sol === true, 'masterAtlas systemsVisited preserved');
assert(saveRoot.masterAtlas.totalDiscoveries === 3, 'masterAtlas totalDiscoveries preserved');

console.log('Universe progress slots round-trip (missions, planets, locations, routes)');
const richUniverse = createEmptyUniverse('Universe 1');
richUniverse.systems = { sol: { explored: true, scanned: false, note: '' } };
richUniverse.missions = { one_small_step: { status: 'active', note: '', completedAt: '' } };
richUniverse.planets = { jemison: { status: 'visited', note: '', survey: { floraFound: 1, floraTotal: 3, faunaFound: 0, faunaTotal: 0, resourcesFound: 0, resourcesTotal: 0, traitsFound: 0, traitsTotal: 0 }, plannedOutpost: true, outpostName: 'Base', priority: 'high', notes: '' } };
richUniverse.locations = { [DISCOVERY_JOURNAL_KEY]: { entries: [{ id: 'd2', title: 'Found vendor' }] } };
richUniverse.routes = { r2: { id: 'r2', name: 'Farm run', stops: ['sol'], pathSystemIds: ['sol', 'alpha_centauri'] } };
saveRoot = { version: 2, activeUniverseId: 'universe_2', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({ version: 2, activeUniverseId: 'universe_2', universes: { universe_2: richUniverse }, masterAtlas: getDefaultMasterAtlas() });
assert(saveRoot.activeUniverseId === 'universe_2', 'activeUniverseId preserved');
assert(saveRoot.universes.universe_2.missions.one_small_step?.status === 'active', 'missions persist');
assert(saveRoot.universes.universe_2.planets.jemison?.plannedOutpost === true, 'outpost survey/planner persist');
assert(saveRoot.universes.universe_2.locations[DISCOVERY_JOURNAL_KEY]?.entries?.length === 1, 'discoveries persist');
assert(saveRoot.universes.universe_2.routes.r2?.name === 'Farm run', 'routes persist');

console.log(`\nMigration tests: ${ok} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
