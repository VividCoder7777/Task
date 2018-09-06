import React from 'react';
import {Link, Router} from 'react-router-dom';
import taskAPI from '../utility/taskAPI';
import Moment from 'moment';
import * as Loader from 'react-spinners';
import TaskItem from './taskItem';
import Calendar from 'react-calendar'
import headerImage from '../images/headerImage.jpg';

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
        this.getTaskProgression = this.getTaskProgression.bind(this);
        this.handleCalenderChange = this.handleCalenderChange.bind(this);
        this.handleCalenderDayClass = this.handleCalenderDayClass.bind(this);

        this.state = {
          tasks: [],
          finishedLoading: false,
          currentDate: Moment(new Date()).format('YYYY-MM-DD')
        };
      }
    
    componentDidMount(){
        taskAPI.read_all_task_get(this.updateTasksCallback);
    }
    // 
    updateTasksCallback(result){

        if (result){
            this.setState({
                tasks: result,
                finishedLoading: true
             });
        } else {
            this.setState({
                finishedLoading: true,
                errorMessage: 'An error has a occurred please try again in a few mintues'
            });
        }

    }

    handleSubmit(event){
        event.preventDefault();
        let elements = event.target.elements;
        let tasks = this.state.tasks.splice(0);

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

        switch(format){
            case 'CSV':
            taskAPI.get_export_data(format);
            break;
        }
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

    // make it grab only today's task
    getTasks(){
      
        let taskItems = [];
        let tasks = this.state.tasks;

        for (let i = 0; i < tasks.length; i++){

            if (tasks[i].toDoDate == this.state.currentDate){
                taskItems.push(
                    (
                        <TaskItem key={tasks[i].id} title={tasks[i].title} description={tasks[i].description} isCompleted={tasks[i].isTaskComplete}>
                            <button data-complete={tasks[i].isTaskComplete} data-id={tasks[i].id} onClick={this.handleComplete}>{tasks[i].isTaskComplete == false ? 'Completed' : 'Undo'}</button>
                            <button><Link to={'/task/' + tasks[i].id + '/edit'}>Edit</Link></button>
                            <button data-id={tasks[i].id} onClick={this.handleDelete}>Delete</button>
                        </TaskItem>
                    )
                );
            }
        }

        if (taskItems.length === 0){
            return (
                <p><b>There are no task for today!</b></p>
            );
        } else {
            return taskItems;
        }
    }

    getTaskProgression(date){
        
        let tasks = this.state.tasks;
        let progression = 0;

        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].toDoDate === date){
                if (tasks[i].isTaskComplete){
                    progression++;
                } 
            }
        }

        return progression;
    }

    handleCalenderChange(date){
        let formattedDate = Moment(date).format('YYYY-MM-DD');
     
        this.setState({
            currentDate: formattedDate
        });
    }

    handleCalenderDayClass({date, view}){
        let formattedDate = Moment(date).format('YYYY-MM-DD');

        return view === 'month' && this.dateHasTask(formattedDate) ? 'hasTask' : null;
    }

    dateHasTask(date){
        let set = new Set();
        let tasks = this.state.tasks;

        for (let task of tasks){
            set.add(task.toDoDate);
        }
        if (set.has(date)){
           
            return true;
        } else {
           
            return false;
        }

    }

    render(){
        const displayErrors = this.state.displayErrors;
        let currentTasks = this.getTasks();

        return (
        <div>
            <div id='taskContent'>
                <div id='introduction'>
                    <div>
                        <h1>Welcome To Task Creator!</h1>
                        <h2>Keep Track of Your Schedule</h2>
                        <h3>Export Them On The Go!</h3>
                        <h4 onClick={this.handleNavigation}>Get Started</h4>
                        <img src={headerImage}/>
                    </div>
                </div>
                <div id='taskcon'>
                    <form id='taskForm' className={displayErrors ? 'displayErrors' : ''} onSubmit={this.handleSubmit} noValidate>
                        <h3>Create A Task</h3>
                        <div id='status' className = {this.state.displayMessage === true ? 'successful' : 'failed'}></div>
                        <div className='input'>
                            <label htmlFor='title'>Task Title:</label>
                            <input id='title' name='title' type='text' required autoComplete="off"  maxLength="30"/>
                        </div>
                        <div className='input'>
                            <label htmlFor='description'>Description:</label>
                            <input id='description' name='description' type='text' autoComplete="off"/>
                        </div>
                        <div className='input'>
                            <label htmlFor='toDoDate'>Scheduled At:</label>
                            <input id='toDoDate' name='toDoDate' defaultValue={this.state.currentDate} type='date' required/>
                        </div>
                        <div className='input'>
                            <button>Submit</button>
                        </div>
                    </form>
                </div>
                <div id='calcon'>
                    <h4>Select The Date</h4>
                    <Calendar minDetail='year' onClickDay={this.handleCalenderChange} tileClassName={this.handleCalenderDayClass}/>
                </div>
                <div>
                    <h4>Export Tasks</h4>
                    <div>
                        <form onSubmit={this.handleExport}>
                            <select id='export' name='export' defaultValue=''>
                                <option value=''>Select a format</option>
                                <option value='CSV'>CSV</option>
                            </select>
                            <button>Export</button>
                        </form>
                    </div>
                </div>
            </div>

            <div id='taskInfo'>
                <div className='dailyTask'>
                    <h3>
                        Today's Tasks: <span id='currentDate'>{this.state.currentDate}</span>
                    </h3>
                    <div className={currentTasks.length ? 'show' : 'hidden'}>
                        <p id='progression'>{this.getTaskProgression(this.state.currentDate)}/{currentTasks.length} Task Completed</p>
                    </div>
                    <div id='taskContainer'>
                        {this.state.finishedLoading === true ? 
                                                                (this.state.errorMessage ? this.state.errorMessage : currentTasks) 
                                                                : this.showLoading()}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}