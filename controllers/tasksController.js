const Task = require('../models/Task');
const cache = require('../config/cache');
const taskEvents = require('../events/events');

// Practical 5: this controller now talks to MongoDB through the Task
// Mongoose model instead of a hand-rolled in-memory array (Practical 4).
// Validation lives on the schema (models/Task.js) — the controller just
// calls the model and forwards whatever error Mongoose throws to the
// centralized error handler via next(err).

async function getAllTasks(req, res, next) {
  try {
    // Practical 9: cache-aside — serve from memory on a hit, query MongoDB
    // only on a miss and store the result for the next request.
    const cached = cache.get(cache.ALL_TASKS);
    if (cached) return res.status(200).json(cached);

    const tasks = await Task.find().sort({ createdAt: -1 });
    cache.set(cache.ALL_TASKS, tasks);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    // Single-task entries are cached under their own key, separate from the list.
    const key = cache.taskKey(req.params.id);
    const cached = cache.get(key);
    if (cached) return res.status(200).json(cached);

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }
    cache.set(key, task);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, completed } = req.body || {};
    const task = await Task.create({ title, description, completed });
    cache.del(cache.ALL_TASKS); // a new task makes the cached list stale
    // Practical 10: respond first, then emit; the listener runs in the background.
    console.log(`[API]          Response sent at ${new Date().toISOString()}`);
    res.status(201).json(task);
    taskEvents.emit('task-created', task, req.user && req.user.id);
  } catch (err) {
    // Mongoose ValidationError (e.g. missing title) is mapped to 400 in
    // the centralized error handler, so we just hand it off.
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, description, completed } = req.body || {};
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true, // return the updated doc, not the pre-update one
      runValidators: true, // re-run schema validation on partial updates too
    });

    if (!task) {
      return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }
    cache.del(cache.ALL_TASKS, cache.taskKey(req.params.id));
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }
    cache.del(cache.ALL_TASKS, cache.taskKey(req.params.id));
    res.status(200).json({ message: 'Task deleted', task });
    taskEvents.emit('task-deleted', task, req.user && req.user.id);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
