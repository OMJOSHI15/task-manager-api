const express = require('express');
const controller = require('../controllers/tasksController');
const validateTaskId = require('../middleware/validateTaskId');
const requireJsonContentType = require('../middleware/requireJson');

const router = express.Router();

router.get('/', controller.getAllTasks);
router.post('/', requireJsonContentType, controller.createTask);
router.get('/:id', validateTaskId, controller.getTaskById);
router.put('/:id', requireJsonContentType, validateTaskId, controller.updateTask);
router.delete('/:id', validateTaskId, controller.deleteTask);

module.exports = router;
