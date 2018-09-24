import React from 'react';
import './home.css';
import headerImage from '../../images/work.jpg';
import {Link} from 'react-router-dom';
import TaskSummary from '../taskInfo';

export default class Home extends React.Component{

    constructor(props){
        super(props);
        this.handleNavigation = this.handleNavigation.bind(this);
    }

    handleNavigation(event){
        let taskCreate = document.getElementById('taskForm');

        if (taskCreate){
            taskCreate.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }
    }

    render(){
        return(
        <div id='homegrid'>
            <div id='introduction'>
                <div>
                    <h1>Welcome To Task Creator!</h1>
                    <h2>Keep Track of Your Schedule</h2>
                    <h3>Export Them To Any Format</h3>
                    <h4><Link to='/dashboard'>Get Started</Link></h4>
                    <img src={headerImage}/>
                </div>
            </div>
        </div>
        );
    }
}