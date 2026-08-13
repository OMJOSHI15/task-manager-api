// Run with `npm run seed`. Wipes the tasks collection and inserts a few
// sample documents so GET /tasks has something to show right after setup.
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Task = require('../models/Task');

const sampleTasks = [
  {
    title: 'Set up Express server',
    description: 'Scaffold the app and the middleware pipeline',
    completed: true,
  },
  {
    title: 'Design CRUD routes',
    description: 'GET/POST/PUT/DELETE for /tasks',
    completed: true,
  },
  {
    title: 'Swap in MongoDB',
    description: 'Practical 5: replace the in-memory array with a Mongoose model',
    completed: true,
  },
  {
    title: 'Write schema validation',
    description: 'Required title, bounded lengths, sensible defaults',
    completed: false,
  },
];

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  const deleted = await Task.deleteMany({});
  const inserted = await Task.insertMany(sampleTasks);

  console.log(`Cleared ${deleted.deletedCount} existing task(s).`);
  console.log(`Inserted ${inserted.length} sample task(s):`);
  inserted.forEach((t) => console.log(`  ${t._id}  ${t.title}`));

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
