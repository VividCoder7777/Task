let router = require('express').Router();
let taskController = require('../server/controllers/taskController');

// TASK
router.get('/tasks', taskController.task_get_all);
router.get('/task/:id', taskController.task_get_one);
router.post('/task/:id/update', taskController.task_update_post);
router.post('/task/create', taskController.task_create_post);
router.post('/task/:id/delete', taskController.task_delete_post);
router.post('/tasks/:format/export', taskController.task_format_export);

module.exports = router;