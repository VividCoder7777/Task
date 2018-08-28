import React from 'react';
import taskAPI from '../utility/taskAPI';
import {Link, Router} from 'react-router-dom';

export default class TaskTable extends React.Component{

    constructor(props){
        super(props);

        this.updateTasksCallback = this.updateTasksCallback.bind(this);

        this.handleDelete = this.handleDelete.bind(this);
        this.deleteCallback = this.deleteCallback.bind(this);

        this.updateOneTaskCallback = this.updateOneTaskCallback.bind(this);
        this.getAllTask = this.getAllTask.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleExport = this.handleExport.bind(this);

        this.state = {
            tasks: props.tasks,
        };
    }

    componentDidMount(){
        taskAPI.read_all_task_get(this.updateTasksCallback);
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

    updateTasksCallback(result){

        if (result){
        this.setState({
            tasks: result
        });
        } else {
        
        }

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

    render(){
        
        return (
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
                        {this.state.tasks.map((value, index)=>{
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
        );
    }
}