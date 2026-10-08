const EventEmitter = require('events');

// Practical 10: one shared emitter for the whole app.
class TaskEvents extends EventEmitter {}
module.exports = new TaskEvents();
