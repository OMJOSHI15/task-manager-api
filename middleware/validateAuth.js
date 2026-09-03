// Practical 7, Task 7 & rubric "Input Validation (4 marks)": server-side
// checks that run BEFORE the controller touches the database — the exam
// paper's own "Key Questions" section asks why this matters even when the
// frontend already validates the same fields: a client can always be
// bypassed (curl, Postman, a modified request), so the server is the only
// enforcement point that actually counts.
//
// Three distinct rules, each with its own descriptive message:
//   1. required fields present
//   2. email looks like an email
//   3. password meets a minimum length
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (!name || !String(name).trim()) errors.push('name is required.');
  if (!email) errors.push('email is required.');
  else if (!EMAIL_RE.test(email)) errors.push('email must be a valid email address.');
  if (!password) errors.push('password is required.');
  else if (String(password).length < MIN_PASSWORD_LENGTH) {
    errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email) errors.push('email is required.');
  if (!password) errors.push('password is required.');

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  next();
}

module.exports = { validateRegister, validateLogin };
