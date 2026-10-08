// Practical 10: create a task and a delete, so the server console shows ordering.
require('dotenv').config();
const BASE = `http://localhost:${process.env.PORT || 5000}`;
const j = { 'Content-Type': 'application/json' };
(async () => {
  const c = { name: 'Bench', email: 'bench@example.com', password: 'bench-pass-1' };
  await fetch(BASE + '/auth/register', { method: 'POST', headers: j, body: JSON.stringify(c) });
  const { token } = await (await fetch(BASE + '/auth/login', { method: 'POST', headers: j, body: JSON.stringify(c) })).json();
  const h = { ...j, Authorization: `Bearer ${token}` };
  const t0 = performance.now();
  const r = await fetch(BASE + '/tasks', { method: 'POST', headers: h, body: JSON.stringify({ title: 'Event demo task' }) });
  const task = await r.json();
  console.log(`POST /tasks -> ${r.status} in ${(performance.now() - t0).toFixed(1)} ms (handler takes 2000 ms)`);
  await new Promise((s) => setTimeout(s, 2500));
  await fetch(BASE + '/tasks/' + task._id, { method: 'DELETE', headers: h });
  console.log('DELETE sent');
})();
