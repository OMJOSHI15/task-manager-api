// In-memory store — no database yet (that's Practical 5). Seeded with a
// couple of tasks so GET has something to return right away.
let tasks = [
  {
    id: 1,
    title: 'Set up Express server',
    description: 'Scaffold the app and the middleware pipeline',
    completed: true,
  },
  {
    id: 2,
    title: 'Design CRUD routes',
    description: 'GET/POST/PUT/DELETE for /tasks',
    completed: true,
  },
  {
    id: 3,
    title: 'Swap in MongoDB',
    description: 'Practical 5: replace this array with a Mongoose model',
    completed: false,
  },
];
let nextId = tasks.length + 1;

function getAllTasks(req, res) {
  res.status(200).json(tasks);
}

function getTaskById(req, res) {
  const task = tasks.find((t) => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }
  res.status(200).json(task);
}

function createTask(req, res, next) {
  const { title, description = '', completed = false } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    const err = new Error('"title" is required and must be a non-empty string.');
    err.status = 400;
    return next(err);
  }

  const task = { id: nextId++, title: title.trim(), description, completed: Boolean(completed) };
  tasks.push(task);
  res.status(201).json(task);
}

function updateTask(req, res, next) {
  const task = tasks.find((t) => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }

  const { title, description, completed } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      const err = new Error('"title" must be a non-empty string.');
      err.status = 400;
      return next(err);
    }
    task.title = title.trim();
  }
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = Boolean(completed);

  res.status(200).json(task);
}

function deleteTask(req, res) {
  const index = tasks.findIndex((t) => t.id === req.taskId);
  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }

  const [deleted] = tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted', task: deleted });
}

// Exposed only so tests/scripts can reset state between runs if needed.
function _resetForTests() {
  tasks = [];
  nextId = 1;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  _resetForTests,
};
