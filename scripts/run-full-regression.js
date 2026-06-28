/* Run every QA script and summarise results */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scriptsDir = __dirname;
const scripts = fs.readdirSync(scriptsDir)
  .filter((f) => f.startsWith('qa-') && f.endsWith('.js') && f !== 'run-full-regression.js' && f !== 'qa-performance-baseline.js')
  .sort();

const results = [];
let failed = 0;

console.log('=== Full Regression Suite ===');
console.log(`Running ${scripts.length} scripts...\n`);

scripts.forEach((script) => {
  const started = Date.now();
  const proc = spawnSync(process.execPath, [path.join(scriptsDir, script)], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  const ms = Date.now() - started;
  const ok = proc.status === 0;
  if (!ok) failed += 1;
  results.push({ script, ok, ms, code: proc.status });
  const status = ok ? 'PASS' : 'FAIL';
  console.log(`${status}  ${script} (${ms}ms)`);
  if (!ok && proc.stdout) {
    const tail = proc.stdout.trim().split('\n').slice(-5).join('\n');
    if (tail) console.log(tail);
  }
  if (!ok && proc.stderr) console.error(proc.stderr.trim());
});

console.log('\n=== Summary ===');
console.log(`Passed: ${results.length - failed}/${results.length}`);
if (failed) {
  console.log('Failed scripts:');
  results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.script}`));
  process.exit(1);
}
console.log('All regression suites passed.');
process.exit(0);
