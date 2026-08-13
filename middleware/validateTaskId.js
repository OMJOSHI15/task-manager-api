const { Types } = require('mongoose');

// Practical 5: ids are now Mongo ObjectIds (24-char hex strings), not
// sequential integers, since Task documents live in MongoDB. This
// middleware rejects malformed ids with a 400 before they ever reach a
// Mongoose query — without it, an invalid id would surface as a 500
// CastError instead of a clean 400.
function validateTaskId(req, res, next) {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    const err = new Error(`Invalid task id "${id}" — must be a valid MongoDB ObjectId.`);
    err.status = 400;
    return next(err);
  }

  next();
}

module.exports = validateTaskId;
