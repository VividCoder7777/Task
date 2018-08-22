let Task = require('../models').Task;


exports.task_create_post = [
    (req, res, next)=>{
        console.log('i am here! oh yeah!');
        console.log(req.body);

        let task = new Task({
            title: req.body.title,
            description: req.body.description,
            toDoDate: req.body.toDoDate
        });

        task.save(task)
            .then((results)=>{
                res.send(results);
            }).catch((error)=>{
                res.send(error);
            });
    }
];

exports.task_get_one = [
    (req, res, next)=>{
        Task.findById(req.params.id)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.send(error);
            })
    },
];

exports.task_get_all = [
    (req, res, next) => {
        Task.findAll()
            .then(result => {
                res.send(result);
            }).catch(error => {
                res.send(error);
            });
    },
];