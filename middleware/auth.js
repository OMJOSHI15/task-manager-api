const jwt = require('jsonwebtoken');

// Practical 7: protects routes by requiring a valid JWT.
//
// Expects `Authorization: Bearer <token>`. jwt.verify() throws on a
// missing/expired/tampered token — the common-mistakes note in the lab
// explicitly calls out letting that throw uncaught and crashing the
// server, so it's wrapped in try/catch and turned into a clean 401
// instead, same error shape (`{ error }`) as the rest of the API.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header. Expected: Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: <user _id>, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = requireAuth;
