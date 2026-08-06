// Catches any request that didn't match a route above it. Registered after
// all routes but before the error handler.
function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `No route matches ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFoundHandler;
