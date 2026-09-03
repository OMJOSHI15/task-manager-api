const express = require('express');
const controller = require('../controllers/tasksController');
const validateTaskId = require('../middleware/validateTaskId');
const requireJsonContentType = require('../middleware/requireJson');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Practical 7 step 6: "Apply the auth middleware to all task routes."
// router.use runs before every route below it in this file.
router.use(requireAuth);

router.get('/', controller.getAllTasks);
router.post('/', requireJsonContentType, controller.createTask);
router.get('/:id', validateTaskId, controller.getTaskById);
router.put('/:id', requireJsonContentType, validateTaskId, controller.updateTask);
router.delete('/:id', validateTaskId, controller.deleteTask);

module.exports = router;
