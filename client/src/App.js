import React, { Component } from 'react';
import './App.css';
import './style/main.css';
import {Switch, Link, Route, Redirect} from 'react-router-dom';
import Dashboard from './component/dashboard';
import Edit from './component/edit';
import Error from './component/error';
import TaskAPI from './utility/taskAPI';
require('dotenv').config();

// The main container
class App extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <div className="App">
        <header className='nav'>
          <ul>
            <li><Link to='/'>Get more done with Task Creator</Link></li>
          </ul>
        </header>
        <Switch>
          <Route path='/' exact component={Dashboard}/>
          <Route path='/task/:id/edit' component={Edit}/>
          <Route component={Error}/>
        </Switch>
      </div>
    );
  }
}

export default App;
