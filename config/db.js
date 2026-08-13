const mongoose = require('mongoose');

// Fail fast instead of hanging forever if MongoDB isn't reachable.
const SERVER_SELECTION_TIMEOUT_MS = 8000;

/**
 * Opens the Mongoose connection and resolves once it's ready.
 * Throws if the URI is missing or the server can't be reached in time —
 * the caller (server.js) decides what to do about that (usually exit).
 */
async function connectDB(uri) {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and set it, ' +
        'or export it in your shell before starting the server.'
    );
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });

  const { host, port, name } = mongoose.connection;
  console.log(`MongoDB connected: ${host}:${port}/${name}`);

  return mongoose.connection;
}

module.exports = connectDB;
