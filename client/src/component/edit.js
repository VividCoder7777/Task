import React from 'react';
import '../style/edit.css';
import taskAPI from '../utility/taskAPI';
import {Route, Redirect, Link} from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

export default class EditTask extends React.Component{

    constructor(props){
        super(props);

        this.getTaskCallback = this.getTaskCallback.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateTaskCallback = this.updateTaskCallback.bind(this);
        this.state = {
            title: '',
            description: '',
            toDoDate: '',
            id: '',
            loading: true,
        };
    }

    componentDidMount(){
        const id = this.props.match.params.id;

        taskAPI.read_task_get(id, this.getTaskCallback);
    }

    getTaskCallback(data){
        if (!data){
           this.setState({
               taskNotFound: true,
               loading: false
           });
        } else {
            this.setState({
                title: data.title,
                description: data.description,
                id: data.id,
                toDoDate: data.toDoDate,
                taskNotFound: false,
                loading: false
            });
        }
    }

    updateTaskCallback(result){
        window.location.href = '/';
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

            taskAPI.update_task_post(this.state.id, body, this.updateTaskCallback);
        } else {
        // failed
            this.setState({ displayErrors: true });
        }
    }

    render(){
      
        const displayErrors = this.state.displayErrors;
        const taskNotFound = this.state.taskNotFound;

        if (taskNotFound === false){
            return (
                <div>
                    <div>
                        <form id='taskForm' className={displayErrors ? 'displayErrors' : ''} onSubmit={this.handleSubmit} noValidate>
                            <h2>Edit Task: {this.state.title}</h2>
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
                                    <td><input id='title' name='title' type='text' defaultValue={this.state.title} required/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor='description'>Description:</label></td>
                                    <td><input id='description' name='description' type='text' defaultValue={this.state.description} required/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor='toDoDate'>Scheduled At:</label></td>
                                    <td><input id='toDoDate' name='toDoDate' type='date' defaultValue={this.state.toDoDate} required/></td>
                                </tr>
                                <tr>
                                    <td><button>Update</button></td>
                                </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            );
        } else if (taskNotFound === true) {
            return (
                <h2>Error! Task Doesn't Exist</h2>
            );
        } else {
            return (
                <div>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={150}
                        color={'#123abc'}
                        loading={this.state.loading}
                    />
                </div>
            );
        }
 
    }
}