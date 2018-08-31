import React from 'react';
import {Link, Router} from 'react-router-dom';
import taskAPI from '../utility/taskAPI';
import Popup from "reactjs-popup";
import Moment from 'moment';
import * as Loader from 'react-spinners';
import TaskItem from './taskItem';

export default class Dashboard extends React.Component{

    constructor(props){
        super(props);
    
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateTasksCallback = this.updateTasksCallback.bind(this);
        this.createTaskCallback = this.createTaskCallback.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteCallback = this.deleteCallback.bind(this);
        this.getAllTask = this.getAllTask.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.updateOneTaskCallback = this.updateOneTaskCallback.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.showLoading = this.showLoading.bind(this);

        this.state = {
          tasks: [],
          finishedLoading: false
        };
      }
    
    componentDidMount(){
        taskAPI.read_all_task_get(this.updateTasksCallback);
        console.log('COMPONENT DID MOUNT!');
    }
    // 
    updateTasksCallback(result){
        console.log('CALLBACK RESULTS ARE ');
        for (let i of result){
            console.log(i);
        }
        if (result){
            this.setState({
                tasks: result,
                finishedLoading: true
             });
        } else {
        
        }

    }

    handleSubmit(event){
        event.preventDefault();
        let elements = event.target.elements;
        let tasks = this.state.tasks.splice(0);
        console.log('TASKS ARE ');
        console.log(tasks);

        // successful
        if (event.target.checkValidity()){
        this.setState({ displayErrors: false });
        let body = {
            title: elements['title'].value,
            description: elements['description'].value,
            toDoDate: elements['toDoDate'].value
        }

        taskAPI.create_task_post(body, this.createTaskCallback);
        this.getAllTask();
        this.clearInput();
        } else {
        // failed
        this.setState({ 
            displayErrors: true,
            tasks: tasks
        });
        }
    }

    clearInput(){
        let inputs = document.getElementsByTagName('input');
        
        for (let input of inputs){
            if (input.type != 'date'){
                input.value="";
            }
        
        }
    }

    createTaskCallback(result){

        if (result){
        this.setState({
            displayMessage: true,
        });
        this.setMessage('Task Created Successfully');
        this.getAllTask();
        } else {
        // set message to unable to create tasks
        this.setState({
            displayMessage: false,
        });
        
        this.setMessage('Failed to Create Task');
        }
    }

    setMessage(message){
        let messageContainer = document.getElementById('status');
        messageContainer.innerText = message;
    }

    handleDelete(event){
        event.preventDefault();
        let id = event.target.dataset.id;
        taskAPI.delete_task_post(id, this.deleteCallback);

    }

    deleteCallback(result){
        if (result){
            this.getAllTask();
        }
    }

    getAllTask(){
        taskAPI.read_all_task_get(this.updateTasksCallback);
    }

    handleComplete(event){
        event.preventDefault();
        let id = event.target.dataset.id
        let isTaskComplete = !(event.target.dataset.complete === 'true' ? true : false);
        
        let body = {
            isTaskComplete : isTaskComplete,
        }
        taskAPI.update_task_post(id, body, this.updateOneTaskCallback);
    }

    
    updateOneTaskCallback(result){
        if (result){

            let tasks = this.state.tasks.splice(0);
            let task = tasks.find((task)=>{
              return task.id === result.id ? true : false;           
            });

            task.isTaskComplete = result.isTaskComplete;
            
            this.setState({
                tasks: tasks,
            });
        }
    }

    handleExport(event){
        event.preventDefault();
        let format = event.target.elements.export.value;
        console.log(format);
        if (format != ''){
            taskAPI.get_export_data(format);
        }
    }

    getDailyTask(){
        
        let dailyTask = [];
        let currentDate = new Date();
        currentDate = Moment(currentDate).format('YYYY-MM-DD');

        for (let i =0; i < this.state.tasks.length; i++){
            if (currentDate == this.state.tasks[i].toDoDate){
                dailyTask.push(this.state.tasks[i]);
            } 
        }

        return dailyTask;
    }

    getFutureTask(){
        let futureTasks = [];
        let currentDate = new Date();
        currentDate = Moment(currentDate).format('YYYY-MM-DD');

        for (let i =0; i < this.state.tasks.length; i++){
            if (currentDate < this.state.tasks[i].toDoDate){
                futureTasks.push(this.state.tasks[i]);
            } 
        }

        return futureTasks;
    }

    getPastTask(){
        let pastTasks = [];
        let currentDate = new Date();
        currentDate = Moment(currentDate).format('YYYY-MM-DD');

        for (let i =0; i < this.state.tasks.length; i++){
            if (currentDate > this.state.tasks[i].toDoDate){
                pastTasks.push(this.state.tasks[i]);
            } 
        }

        return pastTasks;
    }

    showLoading(){
        return (
            <div id='loader'>
                <Loader.PulseLoader
                    sizeUnit={"px"}
                    size={10}
                    color={'#123abc'}
                    loading={this.state.loading}
                />
            </div>
        );
    }

    getTasks(){
      
        if (this.state.tasks.length === 0){
            console.log('THERE ARE 0 TASKS');
            console.log(this.state);
            return (
                <p><b>There are no task for today!</b></p>
            );
        } else {
            let taskItems = [];
            let tasks = this.state.tasks.splice(0);
            console.log('TASK ARE');
            console.log(tasks);
            for (let i = 0; i < tasks.length; i++){
                taskItems.push(
                    (
                        <TaskItem key={tasks[i].id} title={tasks[i].title} description={tasks[i].description}/>
                    )
                );
            }
            return taskItems;
        }
    }

    // delete when done
    showTasks(event){
        console.log('CURRENT STATE??');
        console.log(this.state);
    }

    render(){

        const displayErrors = this.state.displayErrors;
        let currentDate = new Date();
        currentDate.setDate(new Date().getDate());
        currentDate = Moment(currentDate).format('YYYY-MM-DD');
        this.getDailyTask();

        return (
        <div>
            <div id='taskContent'>
                <form id='taskForm' className={displayErrors ? 'displayErrors' : ''} onSubmit={this.handleSubmit} noValidate>
                    <h3>Create A Task</h3>
                    <div id='status' className = {this.state.displayMessage === true ? 'successful' : 'failed'}></div>
                    <div className='input'>
                        <label htmlFor='title'>Task Title:</label>
                        <input id='title' name='title' type='text' required autoComplete="off"/>
                    </div>
                    <div className='input'>
                        <label htmlFor='description'>Description:</label>
                        <input id='description' name='description' type='text' autoComplete="off" onFocus={(event)=>{this.showTasks(event)}}/>
                    </div>
                    <div className='input'>
                        <label htmlFor='toDoDate'>Scheduled At:</label>
                        <input id='toDoDate' name='toDoDate' defaultValue={currentDate} type='date' required/>
                    </div>
                    <div className='input'>
                        <button>Submit</button>
                    </div>
                </form>
            </div>

            <div id='taskInfo'>
                <div className='dailyTask'>
                    <h3>Today's Tasks:{' '}<span id='currentDate'>{currentDate}</span></h3>
                    <div id='taskContainer'>
                        {this.state.finishedLoading === true ? this.getTasks() : this.showLoading()}
                    </div>
                </div>

            </div>
        </div>
        );
    }
}