// Express only treats a middleware as an error handler when it takes all
// four parameters (err, req, res, next) — and it must be the LAST thing
// registered with app.use(), after every route, so errors passed via
// next(err) anywhere in the pipeline eventually land here.
function errorHandler(err, req, res, _next) {
  console.error(err.stack);

  const status = err.status || 500;
  // Never leak the raw stack trace to the client — log it server-side only,
  // and send back a small, structured, consistent error shape.
  res.status(status).json({
    error: status === 500 ? 'Something went wrong' : err.message,
  });
}

module.exports = errorHandler;
