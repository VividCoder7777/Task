import axios from 'axios';
var fileDownload = require('react-file-download');

class TaskAPI{

    constructor(){
        this.API = axios.create({
            baseURL: 'https://tasklist7777.herokuapp.com/api',
            timeout: 10000,
        })
    }
    create_task_post(body, callback){
        
        this.API.post('/task/create', body)
        .then((result)=>{
            callback(true);
        }).catch(error => {
            callback(false);
        });
    }

    read_all_task_get(callback){
        this.API.get('/tasks')
            .then(result => {
                callback(result.data);
            })
            .catch(error => {
                callback(false);
            });
    }

    read_task_get(id, callback){
        this.API.get('/task/' + id)
            .then(result =>{
                if (result){
                    if (callback != undefined){
                       callback(result.data); 
                    }
                } else {
                    if (callback != undefined){
                        callback(false); 
                     }
                }
            })
            .catch(error =>{
                callback(false);
            });
    }

    update_task_post(id, body, callback){
        this.API.post('/task/' + id + '/update', body)
            .then(result => {
                callback(result.data);
            })
            .catch(error => {
                callback(false);
            });
    }

    delete_task_post(id, callback){
        this.API.post('/task/' + id + '/delete')
                .then(result => {
                    if (callback){
                        callback(result)
                    }
                })
                .catch(error => {
                    if (callback){
                        callback(error);
                    }
                });
    }

    get_export_data(format){
        this.API.post('/tasks/' + format + '/export')
        .then(result => {
            fileDownload(result.data, 'filename.csv');
        })
        .catch(error => {
          
        });
    }
}

export default new TaskAPI();