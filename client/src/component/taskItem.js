import React from 'react';
import '../style/taskItem.css';
import {Link} from 'react-router-dom';

export default class TaskItem extends React.Component{



    render(){
        let title = this.props.title.toUpperCase();
        let description = this.props.description;
        let taskComplete = this.props.isCompleted;
        
        return (
            <div className={taskComplete == false ? 'taskEntry' : 'taskEntryCompleted'}>
                <span className={taskComplete == false ? 'ongoing' : 'done'}>{taskComplete == false ? 'Ongoing' : 'Completed'}</span>
                <p id='taskTitle' className='content'><span className='subTitle'></span> {title}</p>
                <p id='taskDetail' className='content'><span className='subTitle'></span> {description}</p>
                <div id='children'>
                    <button data-complete={this.props.isCompleted} data-id={this.props.id} onClick={this.props.handleComplete}>{this.props.isCompleted == false ? 'Completed' : 'Undo'}</button>
                    <Link to={'/task/' + this.props.id + '/edit'}>Edit</Link>
                    <button id='delete' data-id={this.props.id} onClick={this.props.handleDelete}>Delete</button>
                </div>
            </div>
        )
    }
}