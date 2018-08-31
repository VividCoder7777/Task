import React from 'react';
import '../style/taskItem.css';

export default class TaskItem extends React.Component{



    render(){
        let title = this.props.title;
        let description = this.props.description;
        
        return (
            <div className='taskEntry'>
                <h4>Task: {title}</h4>
                <p><b>Description:</b> {description}</p>
            </div>
        )
    }
}