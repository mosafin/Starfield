/* Performance baseline — Node VM runtime (cold init) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'Starmap - Fav v3 .html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)[1];

function el() {
  const node = {
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    dataset: {},
    setAttribute() {},
    getAttribute: () => null,
    addEventListener() {},
    removeEventListener() {},
    appendChild(c) { return c; },
    replaceChildren() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    focus() {},
    select() {},
    click() {}
  };
  node.children = [];
  return node;
}

const sandbox = {
  window: null,
  document: {
    getElementById() {
      const n = el();
      return n;
    },
    createElement: () => el(),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    documentElement: { style: { setProperty: () => {} } },
    body: el()
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  performance: { now: () => Date.now() },
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
  ResizeObserver: class { observe() {} disconnect() {} },
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  location: { hostname: 'localhost', search: '' },
  console
};
sandbox.window = sandbox;

const coldStart = performance.now();
vm.createContext(sandbox);
vm.runInContext(script, sandbox, { timeout: 30000 });
const coldInitMs = Math.round((performance.now() - coldStart) * 10) / 10;

const required = [
  'measureAtlasPerformance',
  'getAtlasHealthReport',
  'getAtlasStatistics',
  'validateAtlas',
  'searchGalactic',
  'getAtlasInsightsCached',
  'getTimelineEventsCached',
  'buildSearchIndex'
];

const missing = required.filter((fn) => typeof sandbox[fn] !== 'function');
if (missing.length) {
  console.error('Missing runtime functions:', missing.join(', '));
  process.exit(1);
}

const perf = sandbox.measureAtlasPerformance();
const health = sandbox.getAtlasHealthReport();
const warmStart = performance.now();
sandbox.rebuildAtlasIndexes();
sandbox.buildSearchIndex();
sandbox.searchGalactic('alpha');
sandbox.getAtlasInsightsCached();
sandbox.getTimelineEventsCached();
const warmMs = Math.round((performance.now() - warmStart) * 10) / 10;

const baseline = {
  recordedAt: new Date().toISOString(),
  appVersion: health.appVersion,
  saveVersion: health.saveVersion,
  coldInitMs,
  warmRebuildMs: warmMs,
  atlasStartupMs: health.performance?.startupMs,
  indexRebuildMs: perf.indexRebuildMs,
  validationMs: perf.validationMs,
  searchIndexBuildMs: perf.searchIndexBuildMs,
  galacticSearchMs: perf.galacticSearchMs,
  timelineGenerationMs: perf.timelineGenerationMs,
  atlasInsightsMs: perf.atlasInsightsMs,
  knowledgeSearchMs: perf.knowledgeSearchMs,
  routePlanningMs: perf.routePlanningMs,
  searchIndexEntries: health.searchIndex?.entryCount,
  validationValid: health.validation?.valid,
  warningCount: (health.warnings || []).length
};

const outPath = path.join(__dirname, '..', 'docs', 'performance-baseline-v1.0.0.json');
fs.writeFileSync(outPath, JSON.stringify(baseline, null, 2));

console.log('=== Performance Baseline v1.0.0 ===');
Object.entries(baseline).forEach(([k, v]) => {
  if (typeof v !== 'object') console.log(`  ${k}: ${v}`);
});
console.log(`\nWritten: ${outPath}`);
process.exit(0);
