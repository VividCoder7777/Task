let router = require('express').Router();
let taskController = require('../server/controllers/taskController');


// TASK
router.get('/tasks', taskController.task_get_all);
router.get('/task/:id', taskController.task_get_one);
router.post('/task/create', taskController.task_create_post);

module.exports = router;