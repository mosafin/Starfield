/* Generate Phase 32 planet stubs for systems missing catalogue bodies */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];
const sysBlock = script.match(/const starSystemsData = \[([\s\S]*?)\n        \];/)[1];
const planetBlock = script.match(/const planetData = \[([\s\S]*?)\n        \];/)[1];

const starSystems = [...sysBlock.matchAll(/\{ id: '([^']+)', name: (?:'([^']*)'|"([^"]*)")/g)].map((m) => ({
  id: m[1],
  name: m[2] || m[3]
}));

const systemsWithPlanets = new Set([...planetBlock.matchAll(/systemId: '([^']+)'/g)].map((m) => m[1]));
const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'];
const romanUpper = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

function getPoint(systemId) {
  const m = sysBlock.match(new RegExp(`id: '${systemId}'[\\s\\S]*?point: ([^,\\n}]+)`));
  if (!m) return 1;
  const raw = m[1].trim().replace(/'/g, '');
  if (raw === 'main') return 1;
  return parseInt(raw, 10) || 1;
}

function bodyCount(point) {
  if (point >= 5) return 6;
  if (point >= 3) return 4;
  if (point >= 2) return 3;
  return 2;
}

function displayName(systemName, index) {
  const base = systemName
    .replace(/'/g, "'")
    .split(' ')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
  return `${base} ${romanUpper[index]}`;
}

const missing = starSystems.filter((s) => !systemsWithPlanets.has(s.id));
const lines = [];

missing.forEach((system) => {
  const count = bodyCount(getPoint(system.id));
  for (let i = 0; i < count; i += 1) {
    const suffix = romans[i];
    lines.push(
      `            { id: '${system.id}_${suffix}', name: '${displayName(system.name, i)}', systemId: '${system.id}', type: '${i === 1 && count > 2 ? 'moon' : 'planet'}', level: null, resources: [] }`
    );
  }
});

// Named mission bodies missing from existing catalogues
const namedExtras = [
  { id: 'anselon', name: 'Anselon', systemId: 'narion', type: 'planet', level: null, resources: [] },
  { id: 'altair_ii', name: 'Altair II', systemId: 'altair', type: 'planet', level: null, resources: [] },
  { id: 'andromas_ii', name: 'Andromas II', systemId: 'andromas', type: 'planet', level: null, resources: [] },
  { id: 'andromas_iii', name: 'Andromas III', systemId: 'andromas', type: 'planet', level: null, resources: [] },
  { id: 'andromas_iv', name: 'Andromas IV', systemId: 'andromas', type: 'planet', level: null, resources: [] },
  { id: 'andromas_iv_a', name: 'Andromas IV-a', systemId: 'andromas', type: 'moon', level: null, resources: [] },
  { id: 'piazzi_viii', name: 'Piazzi VIII', systemId: 'piazzi', type: 'planet', level: null, resources: [] },
  { id: 'valo_vi', name: 'Valo VI', systemId: 'valo', type: 'planet', level: null, resources: [] },
  { id: 'barnards_iv', name: "Barnard's IV", systemId: 'barnards_star', type: 'planet', level: null, resources: [] },
  { id: 'eridani_x', name: 'Eridani X', systemId: 'eridani', type: 'planet', level: null, resources: [] }
];

namedExtras.forEach((p) => {
  if (planetBlock.includes(`id: '${p.id}'`)) return;
  lines.push(
    `            { id: '${p.id}', name: '${p.name}', systemId: '${p.systemId}', type: '${p.type}', level: null, resources: [] }`
  );
});

console.log('Missing systems:', missing.length);
console.log('Generated planet lines:', lines.length);
fs.writeFileSync(path.join(__dirname, 'generated-planets-phase32.txt'), lines.join(',\n'));
