// Express only treats a middleware as an error handler when it takes all
// four parameters (err, req, res, next) — and it must be the LAST thing
// registered with app.use(), after every route, so errors passed via
// next(err) anywhere in the pipeline eventually land here.
function errorHandler(err, req, res, _next) {
  console.error(err.stack);

  // Practical 5: Mongoose throws its own error types for schema-validation
  // failures and malformed ids. Translate them into the same clean 400
  // shape as our hand-thrown errors, instead of letting them fall through
  // to the generic 500 below.
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join('; ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for "${err.path}": ${err.value}` });
  }

  const status = err.status || 500;
  // Never leak the raw stack trace to the client — log it server-side only,
  // and send back a small, structured, consistent error shape.
  res.status(status).json({
    error: status === 500 ? 'Something went wrong' : err.message,
  });
}

module.exports = errorHandler;
