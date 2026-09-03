const express = require('express');
const controller = require('../controllers/authController');
const requireAuth = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validateAuth');

const router = express.Router();

router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/me', requireAuth, controller.me);

module.exports = router;
