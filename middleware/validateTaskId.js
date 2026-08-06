// Supplementary task: route-specific middleware that validates the :id
// param format before the request reaches the controller. Stores the parsed
// integer on req.taskId so controllers don't have to re-parse it.
function validateTaskId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error(`Invalid task id "${req.params.id}" — must be a positive integer.`);
    err.status = 400;
    return next(err);
  }

  req.taskId = id;
  next();
}

module.exports = validateTaskId;
