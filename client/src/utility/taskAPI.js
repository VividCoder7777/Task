import axios from 'axios';
var fileDownload = require('react-file-download');

class TaskAPI{

    constructor(){
        // let env = process.env.NODE_ENV;

        // if (env === 'production'){
        //     this.API = axios.create({
        //         baseURL: process.env.REACT_APP_PROD_PROXY
        //     });
        // } else if (env === 'development'){
        //     this.API = axios.create({
        //         baseURL: process.env.REACT_APP_DEV_PROXY
        //     });
        // }
        this.API = axios.create({
            baseURL: process.env.REACT_APP_DEV_PROXY
        });
        
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

    // probably won't need this, just use current data in browser
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