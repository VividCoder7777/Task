import React from 'react';
import {Link, Router} from 'react-router-dom';
import taskAPI from '../utility/taskAPI';
import Popup from "reactjs-popup";
import Moment from 'moment';
import TaskTable from './taskTable';

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

        this.state = {
          tasks: [],
        };
      }
    
    componentDidMount(){
        taskAPI.read_all_task_get(this.updateTasksCallback);
    }

    updateTasksCallback(result){

        if (result){
        this.setState({
            tasks: result
        });
        } else {
        
        }

    }

    handleSubmit(event){
        event.preventDefault();
        let elements = event.target.elements;

        // successful
        if (event.target.checkValidity()){
        this.setState({ displayErrors: false });
        let body = {
            title: elements['title'].value,
            description: elements['description'].value,
            toDoDate: elements['toDoDate'].value
        }
        console.log(body);
        taskAPI.create_task_post(body, this.createTaskCallback);
        this.getAllTask();
        this.clearInput();
        } else {
        // failed
        this.setState({ displayErrors: true });
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

    render(){

        const displayErrors = this.state.displayErrors;
        let currentDate = new Date();
        currentDate.setDate(new Date().getDate() + 1);
        currentDate = Moment(currentDate).format('YYYY-MM-DD');
        this.getDailyTask();

        return (
        <div>
            <form id='taskForm' className={displayErrors ? 'displayErrors' : ''} onSubmit={this.handleSubmit} noValidate>
                <h2>Create A Task</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>
                        <div id='status' className = {this.state.displayMessage === true ? 'successful' : 'failed'}>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td><label htmlFor='title'>Task Title:</label></td>
                        <td><input id='title' name='title' type='text' required/></td>
                    </tr>
                    <tr>
                        <td><label htmlFor='description'>Description:</label></td>
                        <td><input id='description' name='description' type='text'/></td>
                    </tr>
                    <tr>
                        <td><label htmlFor='toDoDate'>Scheduled At:</label></td>
                        <td><input id='toDoDate' name='toDoDate' defaultValue={currentDate} type='date' required/></td>
                    </tr>
                    <tr>
                        <td><button>Submit</button></td>
                    </tr>
                    </tbody>
                </table>
            </form>
            
            <div className='dailyTask'>
                <h2>Today's Tasks</h2>
                <table id='taskTable'>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>To Do Date</th>
                            <th colSpan='3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getDailyTask().length === 0 ? <tr><td colSpan='5'>No Tasks For Today!</td></tr> : this.getDailyTask().map((value, index)=>{
                            return (
                                <tr key={value.id} className={value.isTaskComplete ? 'isComplete' : ''}>
                                    <td>{index+1}</td>
                                    <td>{value.title}</td>
                                    <td>{value.description}</td>
                                    <td>{value.toDoDate}</td>
                                    <td className='completed'><button data-id={value.id} data-complete={value.isTaskComplete} onClick={this.handleComplete}>{value.isTaskComplete ? 'Undo' : 'Completed'}</button></td>
                                    <td className='edit'><Link to={'/task/' + value.id + '/edit'}>Edit</Link></td>
                                    <td className='delete'><button data-id = {value.id} onClick={this.handleDelete}>Delete</button></td> 
                                </tr>
                                )
                        })}
                      
                    </tbody>
                    <tfoot id='foot'>
                        <tr>
                            <td colSpan='7'>
                                <form onSubmit={this.handleExport}>
                                    <span>Exports as:</span>
                                    <select defaultValue='' name='export'>
                                        <option value='' disabled>Select your format</option>
                                        <option value='csv'>CSV</option>
                                    </select>
                                    <button>Export</button>
                                </form>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className='upcomingTask'>
                <h2>Future's Tasks</h2>
                <table id='taskTable'>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>To Do Date</th>
                            <th colSpan='3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getFutureTask().map((value, index)=>{
                            return (
                            <tr key={value.id} className={value.isTaskComplete ? 'isComplete' : ''}>
                                <td>{index+1}</td>
                                <td>{value.title}</td>
                                <td>{value.description}</td>
                                <td>{value.toDoDate}</td>
                                <td className='completed'><button data-id={value.id} data-complete={value.isTaskComplete} onClick={this.handleComplete}>{value.isTaskComplete ? 'Undo' : 'Completed'}</button></td>
                                <td className='edit'><Link to={'/task/' + value.id + '/edit'}>Edit</Link></td>
                                <td className='delete'><button data-id = {value.id} onClick={this.handleDelete}>Delete</button></td> 
                            </tr>
                            )
                        })}
                    </tbody>
                    <tfoot id='foot'>
                        <tr>
                            <td colSpan='7'>
                                <form onSubmit={this.handleExport}>
                                    <span>Exports as:</span>
                                    <select defaultValue='' name='export'>
                                        <option value='' disabled>Select your format</option>
                                        <option value='csv'>CSV</option>
                                    </select>
                                    <button>Export</button>
                                </form>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>  
            <div className='upcomingTask'>
                <h2>Past Tasks</h2>
                <table id='taskTable'>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>To Do Date</th>
                            <th colSpan='3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getPastTask().map((value, index)=>{
                            return (
                            <tr key={value.id} className={value.isTaskComplete ? 'isComplete' : ''}>
                                <td>{index+1}</td>
                                <td>{value.title}</td>
                                <td>{value.description}</td>
                                <td>{value.toDoDate}</td>
                                <td className='completed'><button data-id={value.id} data-complete={value.isTaskComplete} onClick={this.handleComplete}>{value.isTaskComplete ? 'Undo' : 'Completed'}</button></td>
                                <td className='edit'><Link to={'/task/' + value.id + '/edit'}>Edit</Link></td>
                                <td className='delete'><button data-id = {value.id} onClick={this.handleDelete}>Delete</button></td> 
                            </tr>
                            )
                        })}
                    </tbody>
                    <tfoot id='foot'>
                        <tr>
                            <td colSpan='7'>
                                <form onSubmit={this.handleExport}>
                                    <span>Exports as:</span>
                                    <select defaultValue='' name='export'>
                                        <option value='' disabled>Select your format</option>
                                        <option value='csv'>CSV</option>
                                    </select>
                                    <button>Export</button>
                                </form>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>  
        </div>
        );
    }
}