// Practical 9: measure GET /tasks response time (like Postman's "Time" field).
// Usage (server must already be running):
//   npm start                      -> cached run
//   CACHE_DISABLED=1 npm start     -> uncached run
//   npm run bench                  -> prints the readings
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 5000}`;
const creds = { name: 'Bench', email: 'bench@example.com', password: 'bench-pass-1' };
const RUNS = Number(process.env.RUNS) || 5;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(path, opts = {}) {
  const start = performance.now();
  const res = await fetch(BASE + path, opts);
  const body = await res.json();
  return { status: res.status, ms: performance.now() - start, body };
}

async function token() {
  const headers = { 'Content-Type': 'application/json' };
  await call('/auth/register', { method: 'POST', headers, body: JSON.stringify(creds) }); // 409 if it already exists
  const login = await call('/auth/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: creds.email, password: creds.password }),
  });
  return login.body.token;
}

(async () => {
  const auth = { Authorization: `Bearer ${await token()}` };
  const stats0 = (await call('/debug/cache-stats')).body;
  console.log(`\nCache enabled on server: ${stats0.enabled}`);
  console.log('GET /tasks response times');
  console.log('-------------------------');
  // Optional pacing (START_MS / DELAY_MS) so each reading can be screenshotted.
  await sleep(Number(process.env.START_MS) || 0);
  for (let i = 1; i <= RUNS; i++) {
    if (i > 1) await sleep(Number(process.env.DELAY_MS) || 0);
    const r = await call('/tasks', { headers: auth });
    console.log(`Request ${i}: ${r.ms.toFixed(2)} ms  (status ${r.status}, ${r.body.length} tasks)`);
  }
  const s = (await call('/debug/cache-stats')).body;
  console.log(`\nCache hits: ${s.hits}  misses: ${s.misses}\n`);
})();
