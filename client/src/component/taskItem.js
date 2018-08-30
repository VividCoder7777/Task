import React from 'react';
import '../style/taskItem.css';

export default class TaskItem extends React.Component{



    render(){
        console.log('HELLO');
        console.log(this.props);
        let title = this.props.title;
        let description = this.props.description;
        
        return (
            <div>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        )
    }
}