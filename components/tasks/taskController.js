let Task = require('../../server/models').Task;
const Json2csvParser = require('json2csv').Parser;


exports.task_create_post = [
    (req, res, next)=>{
        let task = new Task({
            title: req.body.title,
            description: req.body.description,
            toDoDate: req.body.toDoDate,
            user: req.user.id
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
        Task.findAll({
            include: ['User'],
            where: {
                user: req.user.id,
            },
        })
            .then(result => {
                res.send(result);
            }).catch(error => {
                res.send(error);
            });
    },
];

exports.task_update_post = [
    (req, res, next) => {

        // check if it exist
        Task.findById(req.params.id)
            .then(result => {
                if (!result){
                    res.status(404).send(false);
                } else {
                    // update it if it does
                    result.update(req.body)
                        .then(updated => {
                            res.send(updated);
                        })
                        .catch(error => {
                            res.status(404).send(false);
                        });
                    
                }
            })
            .catch(error => {
                res.status(404).send(false);
            });
        
    }
];

exports.task_delete_post = [
    (req, res, next) => {
        Task.findById(req.params.id)
            .then(result => {
                if (result){
                    result.destroy()
                        .then(result => {
                            res.send(true)
                        })
                        .catch(error => {
                            res.send(false);
                        });
                }
            })
            .catch(error => {
                res.send(false);
            });
    },
];

exports.task_format_export = [
    (req, res, next) => {

        let format = req.params.format.toLowerCase();

        switch (format){
            case 'csv':
                // grab data from databse 

                const parser = new Json2csvParser();
                //const csv = parser.parse(myData);
                Task.findAll()
                    .then(result => {
                        let data = [];
                        for (let i = 0; i < result.length; i++){
                            data.push(result[i].dataValues);
                        }
                        const csv = parser.parse(data);
                        res.send(csv);
                }).catch(error => {
                    res.send(error);
                });
            break;
            default: 
                res.send(false);
        }
    }
];