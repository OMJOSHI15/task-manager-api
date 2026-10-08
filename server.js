require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cacheModule = require('./config/cache');
require('./events/listeners'); // Practical 10: register listeners before any emit
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const requestLogger = require('./middleware/logger');
const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- global middleware ----
// Practical 6: the React dev server runs on a different origin
// (localhost:5173) than this API, so the browser blocks the request
// unless the server explicitly allows it via CORS.
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ---- routes ----
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API is running.',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
    endpoints: [
      'POST   /auth/register',
      'POST   /auth/login',
      'GET    /auth/me           (requires Authorization: Bearer <token>)',
      'GET    /tasks             (requires Authorization: Bearer <token>)',
      'POST   /tasks             (requires Authorization: Bearer <token>)',
      'GET    /tasks/:id         (requires Authorization: Bearer <token>)',
      'PUT    /tasks/:id         (requires Authorization: Bearer <token>)',
      'DELETE /tasks/:id         (requires Authorization: Bearer <token>)',
    ],
  });
});

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

// Practical 9 (supplementary): cache hit/miss counters for the debug page.
app.get('/debug/cache-stats', (req, res) => {
  const { hits, misses } = cacheModule.stats;
  res.json({ enabled: cacheModule.enabled, hits, misses, total: hits + misses });
});

// Demo route for the error handler — deliberately throws so you can see the
// global handler catch it and return a clean 500 instead of crashing.
app.get('/debug/throw', (req, res, next) => {
  try {
    throw new Error('Deliberate test error for the global error handler');
  } catch (err) {
    next(err);
  }
});

// ---- 404 for anything that didn't match a route above ----
app.use(notFoundHandler);

// ---- global error handler — MUST be registered last ----
app.use(errorHandler);

// Practical 5: connect to MongoDB before accepting traffic. If the
// database is unreachable, fail loudly and exit rather than serving an
// API that will 500 on every /tasks request.
async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Task Manager API listening on port ${PORT}`);
  });
}

// Only auto-start when run directly (`node server.js`), not when required
// by a test file that wants to manage its own connection/lifecycle.
if (require.main === module) {
  start();
}

// Graceful shutdown: close the Mongo connection cleanly on Ctrl+C.
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\nMongoDB connection closed. Bye!');
  process.exit(0);
});

module.exports = app;
