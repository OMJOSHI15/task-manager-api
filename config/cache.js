const NodeCache = require('node-cache');

// Practical 9: process-local in-memory cache (node-cache). Entries expire
// after 60 s; every write handler also deletes the affected keys, so the TTL
// is only a safety net, not the thing that keeps data correct.
//
// Set CACHE_DISABLED=1 to bypass the cache entirely — used to take the
// "uncached" response-time readings for comparison without editing code.
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
const enabled = process.env.CACHE_DISABLED !== '1';

// Supplementary task: hit/miss counters, exposed at GET /debug/cache-stats.
const stats = { hits: 0, misses: 0 };

function get(key) {
  if (!enabled) return undefined;
  const value = cache.get(key);
  if (value === undefined) stats.misses += 1;
  else stats.hits += 1;
  return value;
}

function set(key, value) {
  if (enabled) cache.set(key, value);
}

function del(...keys) {
  cache.del(keys);
}

module.exports = {
  get,
  set,
  del,
  stats,
  enabled,
  ALL_TASKS: 'all_tasks',
  taskKey: (id) => `task_${id}`,
};
