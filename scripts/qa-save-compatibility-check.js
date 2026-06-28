/* Save compatibility — fresh, mid-game, late-game, legacy v1, export shapes */
const fs = require('fs');
const path = require('path');

const UNIVERSE_IDS = ['universe_1', 'universe_2', 'universe_3', 'universe_4'];
const DISCOVERY_JOURNAL_KEY = '__discoveryJournal__';

function createEmptyUniverse(name) {
  return {
    name,
    systems: {},
    missions: {},
    planets: {},
    locations: {},
    routes: {},
    fleet: { ships: {} },
    crew: { members: {} },
    homes: { currentHomeId: null, owned: {} },
    milestones: { unityEntered: false, ngPlusLevel: 0, notes: '' }
  };
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
  return Object.keys(data).some((k) => data[k] && typeof data[k] === 'object' && ('explored' in data[k] || 'scanned' in data[k]));
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
      if (data.universes[id]) saveRoot.universes[id] = { ...saveRoot.universes[id], ...data.universes[id] };
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

function getSavePayload() {
  return {
    version: saveRoot.version,
    activeUniverseId: saveRoot.activeUniverseId,
    universes: saveRoot.universes,
    masterAtlas: saveRoot.masterAtlas
  };
}

function exportUniverse(universeId) {
  const u = saveRoot.universes[universeId];
  if (!u) return null;
  return JSON.parse(JSON.stringify(u));
}

let ok = 0;
let fail = 0;
function assert(cond, msg) {
  if (cond) { ok++; console.log('  OK:', msg); }
  else { fail++; console.log('  FAIL:', msg); }
}

console.log('Fresh save (empty v2 envelope)');
saveRoot = {
  version: 2,
  activeUniverseId: 'universe_1',
  universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])),
  masterAtlas: getDefaultMasterAtlas()
};
const fresh = getSavePayload();
assert(fresh.version === 2, 'fresh save version is 2');
assert(Object.keys(fresh.universes).length === 4, 'fresh save has 4 universes');
assert(Object.keys(fresh.universes.universe_1.systems).length === 0, 'fresh universe_1 has no systems');

console.log('Mid-game save');
const mid = createEmptyUniverse('Universe 1');
mid.systems = {
  sol: { explored: true, scanned: true, note: 'Home', exploredAt: '2026-01-15' },
  alpha_centauri: { explored: true, scanned: false, note: '' }
};
mid.missions = {
  one_small_step: { status: 'completed', note: '', completedAt: '2026-01-16' },
  into_the_unknown: { status: 'active', note: 'Next stop', completedAt: '' }
};
mid.planets = {
  jemison: { status: 'visited', note: '', survey: { floraFound: 2, floraTotal: 5, faunaFound: 0, faunaTotal: 0, resourcesFound: 1, resourcesTotal: 3, traitsFound: 0, traitsTotal: 0 }, plannedOutpost: false, outpostName: '', priority: '', notes: '' }
};
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({ version: 2, activeUniverseId: 'universe_1', universes: { universe_1: mid }, masterAtlas: getDefaultMasterAtlas() });
assert(saveRoot.universes.universe_1.missions.into_the_unknown?.status === 'active', 'mid-game active mission preserved');
assert(saveRoot.universes.universe_1.planets.jemison?.survey?.floraFound === 2, 'mid-game survey preserved');

console.log('Late-game save');
const late = createEmptyUniverse('Universe 2');
const systemIds = ['sol', 'alpha_centauri', 'cheyenne', 'volii', 'kryx', 'narion', 'lantana'];
systemIds.forEach((id) => {
  late.systems[id] = { explored: true, scanned: true, note: '', exploredAt: '2026-03-01' };
});
late.missions = { one_small_step: { status: 'completed', completedAt: '2026-01-01', note: '' } };
late.locations = { [DISCOVERY_JOURNAL_KEY]: { entries: Array.from({ length: 12 }, (_, i) => ({ id: `d${i}`, title: `Discovery ${i}`, discoveredAt: '2026-02-01' })) } };
late.routes = { r_main: { id: 'r_main', name: 'Main loop', stops: systemIds, pathSystemIds: systemIds, savedAt: '2026-03-01' } };
late.fleet = {
  ships: { ship_1: { id: 'ship_1', name: 'Frontier', class: 'Class C', homeSystemId: 'alpha_centauri', currentSystemId: 'sol', notes: '', addedAt: '2026-03-01' } }
};
late.crew = {
  members: { crew_1: { id: 'crew_1', name: 'Sarah', roleType: 'pilot', homeShipId: 'ship_1', assignment: 'Frontier', notes: '', addedAt: '2026-03-01' } }
};
late.homes = {
  currentHomeId: 'home_1',
  owned: { home_1: { id: 'home_1', name: 'The Lodge', type: 'player_home', systemId: 'alpha_centauri', notes: '', addedAt: '2026-03-01' } }
};
saveRoot = { version: 2, activeUniverseId: 'universe_2', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({
  version: 2,
  activeUniverseId: 'universe_2',
  universes: { universe_2: late },
  masterAtlas: { systemsVisited: Object.fromEntries(systemIds.map((id) => [id, true])), planetsSurveyed: {}, locationsDiscovered: {}, discoveryIds: {}, totalDiscoveries: 12 }
});
assert(saveRoot.activeUniverseId === 'universe_2', 'late-game active universe preserved');
assert(saveRoot.universes.universe_2.fleet?.ships?.ship_1?.name === 'Frontier', 'late-game fleet ships preserved');
assert(saveRoot.universes.universe_2.routes.r_main?.stops?.length === 7, 'late-game routes preserved');
assert(saveRoot.masterAtlas.totalDiscoveries === 12, 'late-game masterAtlas preserved');

console.log('Full atlas export round-trip');
saveRoot = { version: 2, activeUniverseId: 'universe_2', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({
  version: 2,
  activeUniverseId: 'universe_2',
  universes: { universe_2: late },
  masterAtlas: { systemsVisited: Object.fromEntries(systemIds.map((id) => [id, true])), planetsSurveyed: {}, locationsDiscovered: {}, discoveryIds: {}, totalDiscoveries: 12 }
});
const fullExport = getSavePayload();
const serialized = JSON.stringify(fullExport);
const parsed = JSON.parse(serialized);
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat(parsed);
assert(saveRoot.universes.universe_2.fleet?.ships?.ship_1?.name === 'Frontier', 'full export round-trip keeps fleet');
assert(saveRoot.masterAtlas.totalDiscoveries === 12, 'full export round-trip keeps masterAtlas');

console.log('Universe-only export (single profile merge shape)');
const uniExport = exportUniverse('universe_2');
assert(uniExport?.fleet?.ships?.ship_1?.name === 'Frontier', 'universe export includes fleet');
assert(uniExport?.routes?.r_main?.name === 'Main loop', 'universe export includes routes');
assert(!('masterAtlas' in uniExport), 'universe export excludes masterAtlas envelope');

console.log('Legacy v1 flat system save');
saveRoot = { version: 2, activeUniverseId: 'universe_1', universes: Object.fromEntries(UNIVERSE_IDS.map((id, i) => [id, createEmptyUniverse(`Universe ${i + 1}`)])), masterAtlas: getDefaultMasterAtlas() };
migrateSaveToUniverseFormat({ narion: { explored: true, scanned: false, note: 'legacy' } });
assert(saveRoot.universes.universe_1.systems.narion?.note === 'legacy', 'v1 flat save migrates to universe_1');

console.log(`\nSave compatibility: ${ok} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
