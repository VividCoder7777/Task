import axios from 'axios';

class TaskAPI{

    constructor(){
        this.API = axios.create({
            baseURL: 'http://localhost:5001/api',
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

    update_task_post(id, callback){
        this.API.post('/task/' + id + '/edit')
            .then(result => {
                callback(result);
            })
            .catch(error => {
                callback(false);
            });
    }
}

export default new TaskAPI();