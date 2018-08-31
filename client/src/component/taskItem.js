import React from 'react';
import '../style/taskItem.css';

export default class TaskItem extends React.Component{



    render(){
        let title = this.props.title;
        let description = this.props.description;
        let taskComplete = this.props.isCompleted;

        return (
            <div className={taskComplete == false ? 'taskEntry' : 'taskEntryCompleted'}>
                <span className={taskComplete == false ? 'ongoing' : 'done'}>{taskComplete == false ? 'Ongoing' : 'Completed'}</span>
                <h4>Task: {title}</h4>
                <p><b>Description:</b> {description}</p>
                <div id='children'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}