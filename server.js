const express = require('express');
const tasksRouter = require('./routes/tasks');
const requestLogger = require('./middleware/logger');
const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- global middleware ----
app.use(express.json());
app.use(requestLogger);

// ---- routes ----
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API is running.',
    endpoints: [
      'GET    /tasks',
      'POST   /tasks',
      'GET    /tasks/:id',
      'PUT    /tasks/:id',
      'DELETE /tasks/:id',
    ],
  });
});

app.use('/tasks', tasksRouter);

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

app.listen(PORT, () => {
  console.log(`Task Manager API listening on port ${PORT}`);
});

module.exports = app;
