// Applied globally in server.js. Logs method, URL, and an ISO timestamp for
// every incoming request, then hands off to the next middleware.
function requestLogger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}

module.exports = requestLogger;
