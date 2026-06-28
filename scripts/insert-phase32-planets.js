/* Insert Phase 32 planet catalogue into HTML */
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'Starmap - Fav v3 .html');
const planets = fs.readFileSync(path.join(__dirname, 'generated-planets-phase32.txt'), 'utf8').trim();
let html = fs.readFileSync(htmlPath, 'utf8');

if (html.includes('alpha_andraste_i')) {
  console.log('Phase 32 planets already inserted');
  process.exit(0);
}

const marker = /            \{ id: 'bohr_viii', name: 'Bohr VIII', systemId: 'bohr', type: 'planet', level: null, resources: \[\] \}\r?\n        \];/;
const replacement = `            { id: 'bohr_viii', name: 'Bohr VIII', systemId: 'bohr', type: 'planet', level: null, resources: [] },
            // --- Phase 32 Core Atlas expansion (numbered stubs + mission-validated bodies) ---
${planets}
        ];`;

if (!marker.test(html)) {
  console.error('Marker not found');
  process.exit(1);
}

html = html.replace(marker, replacement);
fs.writeFileSync(htmlPath, html);
console.log('Inserted', planets.split('\n').length, 'planet entries');
