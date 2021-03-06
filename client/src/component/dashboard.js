import React from 'react';
import taskAPI from '../utility/taskAPI';
import Moment from 'moment';
import * as Loader from 'react-spinners';
import TaskItem from './taskItem';
import Calendar from 'react-calendar'
import headerImage from '../images/work.jpg';
import TaskSummary from './taskInfo';

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
        this.handleCalenderChange = this.handleCalenderChange.bind(this);
        this.handleCalenderDayClass = this.handleCalenderDayClass.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);

        this.state = {
          tasks: [],
          finishedLoading: false,
          currentDate: Moment(new Date()).format('YYYY-MM-DD'),
          username: ''
        };
      }
    
    componentDidMount(){
        this.getAllTask();
    }
    // 
    updateTasksCallback(result){

        if (result){

            let username = '';
            if (result[0]){
                username = result[0].User.username;
            }

            this.setState({
                tasks: result,
                finishedLoading: true,
                username: username
             });
        } else {
            this.setState({
                finishedLoading: true,
                errorMessage: 'An error has a occurred please try again in a few mintues'
            });
        }

    }

    handleNavigation(event){
        let taskCreate = document.getElementById('taskForm');

        if (taskCreate){
            taskCreate.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
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
        let isTaskComplete = !(event.target.dataset.complete === 'true');
        
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
                        <TaskItem key={tasks[i].id} 
                                  title={tasks[i].title} 
                                  description={tasks[i].description} 
                                  isCompleted={tasks[i].isTaskComplete}
                                  handleComplete={this.handleComplete}
                                  handleDelete={this.handleDelete}
                                  id={tasks[i].id}
                                  >
                                 
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
             <TaskSummary tasks = {this.state.tasks} name={this.state.username}/>
            <div id='taskContent'>
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