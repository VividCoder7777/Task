import React from 'react';
import {Link, Router} from 'react-router-dom';
import taskAPI from '../utility/taskAPI';

export default class Dashboard extends React.Component{

    constructor(props){
        super(props);
    
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateTasksCallback = this.updateTasksCallback.bind(this);
        this.createTaskCallback = this.createTaskCallback.bind(this);
    
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

        taskAPI.create_task_post(body, this.createTaskCallback);
        this.clearInput();
        } else {
        // failed
        this.setState({ displayErrors: true });
        console.log('invalid');
        }
    }

    clearInput(){
        let inputs = document.getElementsByTagName('input');
        
        for (let input of inputs){
        input.value="";
        }
    }

    createTaskCallback(result){

        if (result){
        this.setState({
            displayMessage: true,
        });
        this.setMessage('Task Created Successfully');
        taskAPI.read_all_task_get(this.updateTasksCallback);
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

    render(){

        const displayErrors = this.state.displayErrors;
        
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
                    <td><input id='description' name='description' type='text' required/></td>
                </tr>
                <tr>
                    <td><label htmlFor='toDoDate'>Scheduled At:</label></td>
                    <td><input id='toDoDate' name='toDoDate' type='date' required/></td>
                </tr>
                <tr>
                    <td><button>Submit</button></td>
                </tr>
                </tbody>
            </table>
            </form>

            <div className='dailyTask'>
            <h2>Today's Tasks</h2>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>To Do Date</th>
                </tr>
                </thead>
                <tbody>
                {this.state.tasks.map((value, index)=>{
                    return (
                    <tr key={value.id}>
                        <td>{value.title}</td>
                        <td>{value.description}</td>
                        <td>{value.toDoDate}</td>
                        <td className='edit'><Link to={'/task/' + value.id + '/edit'}>Edit</Link></td>
                        <td className='delete'><Link to={'/task/' + value.id + '/delete'}>Delete</Link></td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
            <div className='upcomingTask'>
            <h2>Tommorow's Tasks</h2>
            </div>  
        </div>
        );
    }
}