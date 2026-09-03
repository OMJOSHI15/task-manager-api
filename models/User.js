const { Schema, model } = require('mongoose');

// Practical 7: User schema for authentication.
//   name      - required, trimmed
//   email     - required, unique, lowercased (so "A@x.com" and "a@x.com"
//               collide instead of creating two accounts)
//   password  - required, stores the bcrypt HASH, never the plain text.
//               Hashing happens in the register controller before
//               User.create() is called (Task 3 of the lab steps), not
//               here in the schema — keeps the model a thin data
//               contract, same style as Task.js.
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email must be a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
