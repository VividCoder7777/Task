import React from 'react';
import '../style/taskinfo.css';
import Moment from 'moment';

export default class TaskSummary extends React.Component{
    
    constructor(props){
        super(props);
        this.getTask = this.getTask.bind(this);
        this.getTaskProgression = this.getTaskProgression.bind(this);
        this.getTasksForDate = this.getTasksForDate.bind(this);
    }

    getTask(date){

        let tasks = this.props.tasks;

        if (!tasks) return 0;

        let dateTasks = [];

        for (let task of tasks){
            if (task.toDoDate == date){
                dateTasks.push(task);
            }
        }

        return dateTasks.length;

    }

    getTaskProgression(date){
        
        let tasks = this.props.tasks;
        let progression = 0;

        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].toDoDate === date){
                if (tasks[i].isTaskComplete){
                    progression++;
                } 
            }
        }

        return progression;
    }

    getTasksForDate(date){

        let tasks = this.props.tasks;
        let total = 0;

        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].toDoDate === date){
                    total++;
            }
        }
   
        return total;
    }

    formatDate(date){
        return Moment(date).format('YYYY-MM-DD');
    }

    render(){
        
        let today = new Date();
        today = this.formatDate(today);

        let tommorow = new Date();
        tommorow.setDate(tommorow.getDate() + 1);
        tommorow = this.formatDate(tommorow); 

        let yesterday = new Date();
        yesterday = yesterday.setDate(yesterday.getDate() - 1);
        yesterday = this.formatDate(yesterday);

        return (
            <div id='taskgrid'>
                <div>
                    <span className='taskdisplay'>{today}</span>
                    <p>Current Date</p>
                </div>
                <div>
                    <span className='taskdisplay'>{this.getTask(yesterday)}</span>
                    <p>Yesterday's Task</p>
                </div>
                <div>
                    <span className='taskdisplay'>{this.getTask(today)}</span>
                    <p>Today's Task</p>
                </div>
                <div>
                    <span className='taskdisplay'>{this.getTask(tommorow)}</span>
                    <p>Tommorow's Task</p>
                </div>
                <div id='taskCompleted'>
                    {this.getTasksForDate(today) === 0 ? (
                        <div id='progressCon'>
                            <span className='taskdisplay'>0 Task Today</span>
                        </div>
                    ) : (
                        <div id='progressCon'>
                            <span className='taskdisplay'>{this.getTaskProgression(today)}/{this.getTasksForDate(today)}</span>
                            <p>Task Completed</p>
                        </div>
                    )}
                </div>
                <div id='createTask'>
                    <span className='taskdisplay'>Hello {this.props.name}</span>
                </div>
            </div>
        );
    }
}