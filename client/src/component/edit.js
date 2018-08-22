import React from 'react';
import '../style/edit.css';
import API from '../utility/taskAPI';

export default class EditTask extends React.Component{

    constructor(props){
        super(props);

        this.getTaskCallback = this.getTaskCallback.bind(this);
        this.state = {
            title: '',
            description: '',
            toDoDate: '',
            id: '',
        };
    }

    componentDidMount(){
        const id = this.props.match.params.id;

        API.read_task_get(id, this.getTaskCallback);
    }

    getTaskCallback(data){
        console.log('THE DATA!');
        console.log(data);
        this.setState({
            title: data.title,
            description: data.description,
            id: data.id,
            toDoDate: data.toDoDate
        });
    }

    render(){
        // console.log(this.props);
        // console.log(this.props.match.params.id);
        const displayErrors = this.state.displayErrors;

        return (
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
                    <td><input id='title' name='title' type='text' value={this.state.title} required/></td>
                </tr>
                <tr>
                    <td><label htmlFor='description'>Description:</label></td>
                    <td><input id='description' name='description' type='text' value={this.state.description} required/></td>
                </tr>
                <tr>
                    <td><label htmlFor='toDoDate'>Scheduled At:</label></td>
                    <td><input id='toDoDate' name='toDoDate' type='date' value={this.state.toDoDate} required/></td>
                </tr>
                <tr>
                    <td><button>Update</button></td>
                </tr>
                </tbody>
            </table>
            </form>
        </div>
        );
    }
}