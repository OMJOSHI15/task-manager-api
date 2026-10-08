const taskEvents = require('./events');

// Practical 10: background handlers. emit() calls listeners synchronously,
// so each handler defers its work with setTimeout/setImmediate; that is what
// lets the HTTP response go out first. SLOW_MS simulates a slow notifier.
const SLOW_MS = Number(process.env.NOTIFY_DELAY_MS) || 2000;
const now = () => new Date().toISOString();

taskEvents.on('task-created', (task, userId) => {
  console.log(`[Event]        task-created received at ${now()}`);
  setTimeout(() => {
    try {
      console.log(
        `[Notification] Task "${task.title}" created by user ${userId} | handler finished at ${now()}`
      );
    } catch (err) {
      taskEvents.emit('error', err);
    }
  }, SLOW_MS);
});

// Supplementary: second event with its own, different message.
taskEvents.on('task-deleted', (task, userId) => {
  setImmediate(() => {
    console.log(`[Notification] Task "${task.title}" was DELETED by user ${userId} at ${now()}`);
  });
});

// Supplementary: catches anything thrown inside a handler.
taskEvents.on('error', (err) => {
  console.error(`[Event Error] ${err.message} at ${now()}`);
});
