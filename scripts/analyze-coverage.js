/* Analyse atlas coverage gaps for Phase 32 planning */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

function extractArray(name) {
  const m = script.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n        \\];`));
  if (!m) return [];
  const ids = [...m[1].matchAll(/id: '([^']+)'/g)].map((x) => x[1]);
  const systemIds = [...m[1].matchAll(/systemId: '([^']+)'/g)].map((x) => x[1]);
  const entries = [];
  const blocks = m[1].split(/\n            \{/).slice(1);
  blocks.forEach((block) => {
    const id = block.match(/id: '([^']+)'/)?.[1];
    const systemId = block.match(/systemId: '([^']+)'/)?.[1] || block.match(/systemId: null/)?.[0] ? null : null;
    const sid = block.includes("systemId: null") ? null : block.match(/systemId: '([^']+)'/)?.[1];
    entries.push({ id, systemId: sid });
  });
  return entries;
}

const systems = [...script.matchAll(/\{ id: '([^']+)', name: '([^']+)'/g)].slice(0, 130).map((m) => ({ id: m[1], name: m[2] }));
// Better: parse starSystemsData
const sysBlock = script.match(/const starSystemsData = \[([\s\S]*?)\n        \];/)[1];
const starSystems = [];
[...sysBlock.matchAll(/\{\s*\n\s*id: '([^']+)',\s*\n\s*name: '([^']+)'/g)].forEach((m) => {
  starSystems.push({ id: m[1], name: m[2] });
});

const planetBlock = script.match(/const planetData = \[([\s\S]*?)\n        \];/)[1];
const planetsBySystem = {};
[...planetBlock.matchAll(/\{ id: '([^']+)', name: '([^']+)', systemId: '([^']+)'/g)].forEach((m) => {
  if (!planetsBySystem[m[3]]) planetsBySystem[m[3]] = [];
  planetsBySystem[m[3]].push({ id: m[1], name: m[2] });
});

const locBlock = script.match(/const locationData = \[([\s\S]*?)\n        \];/)[1];
const locsBySystem = {};
[...locBlock.matchAll(/id: '([^']+)',\s*\n\s*name: '([^']+)',\s*\n\s*type: '([^']+)',\s*\n\s*systemId: '([^']+)'/g)].forEach((m) => {
  if (!locsBySystem[m[4]]) locsBySystem[m[4]] = [];
  locsBySystem[m[4]].push({ id: m[1], name: m[2], type: m[3] });
});

const missionBlock = script.match(/const missionData = \[([\s\S]*?)\n        \];/)[1];
const missionsBySystem = {};
[...missionBlock.matchAll(/systemId: '([^']+)'/g)].forEach((m) => {
  missionsBySystem[m[1]] = (missionsBySystem[m[1]] || 0) + 1;
});

const missingPlanets = starSystems.filter((s) => !planetsBySystem[s.id]);
const withPlanetsNoLoc = starSystems.filter((s) => planetsBySystem[s.id] && !locsBySystem[s.id]);
const withMissionsNoPlanets = starSystems.filter((s) => missionsBySystem[s.id] && !planetsBySystem[s.id]);

console.log('Systems:', starSystems.length);
console.log('Systems with planets:', starSystems.length - missingPlanets.length);
console.log('Systems missing planets:', missingPlanets.length);
console.log('\nMissing planets (first 40):');
missingPlanets.slice(0, 40).forEach((s) => {
  console.log(`  ${s.id} (${s.name}) missions:${missionsBySystem[s.id] || 0}`);
});
console.log('\nWith planets but no locations:', withPlanetsNoLoc.length);
withPlanetsNoLoc.forEach((s) => console.log(`  ${s.id} (${s.name}) planets:${planetsBySystem[s.id].length}`));
console.log('\nMission systems missing planets:', withMissionsNoPlanets.length);
withMissionsNoPlanets.forEach((s) => console.log(`  ${s.id} (${s.name}) missions:${missionsBySystem[s.id]}`));
