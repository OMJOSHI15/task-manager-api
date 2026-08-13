const { Schema, model } = require('mongoose');

// Schema design (Practical 5):
//   title       - required, trimmed, 1-120 chars
//   description - optional, trimmed, up to 1000 chars, defaults to ''
//   completed   - boolean flag, defaults to false
//   timestamps  - createdAt/updatedAt added automatically by Mongoose
//
// Validation lives on the schema itself (not hand-rolled in the
// controller like Practical 4's in-memory version) so it's enforced no
// matter what calls .save()/.create() — controller, seed script, or
// a future admin script.
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      minlength: [1, 'title cannot be empty'],
      maxlength: [120, 'title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'description cannot exceed 1000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model('Task', taskSchema);
