const Task = require('../models/Task');

// Practical 5: this controller now talks to MongoDB through the Task
// Mongoose model instead of a hand-rolled in-memory array (Practical 4).
// Validation lives on the schema (models/Task.js) — the controller just
// calls the model and forwards whatever error Mongoose throws to the
// centralized error handler via next(err).

async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, completed } = req.body || {};
    const task = await Task.create({ title, description, completed });
    res.status(201).json(task);
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
    res.status(200).json({ message: 'Task deleted', task });
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
