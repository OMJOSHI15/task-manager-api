// Supplementary task: reject POST/PUT requests that don't declare a JSON
// Content-Type, before they ever reach the controller.
function requireJsonContentType(req, res, next) {
  const contentType = req.headers['content-type'] || '';

  if (!contentType.includes('application/json')) {
    const err = new Error('Content-Type must be application/json');
    err.status = 415;
    return next(err);
  }

  next();
}

module.exports = requireJsonContentType;
