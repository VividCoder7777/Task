import React, { Component } from 'react';
import './App.css';
import './style/main.css';
import {Switch, Link, Route, Redirect} from 'react-router-dom';
import Dashboard from './component/dashboard';
import Edit from './component/edit';
import ErrorPage from './component/error';

// The main container
class App extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <div className="App">
        <nav className='nav'>
          <ul id='flexNav'>
            <li><Link to='/'>Get more done with Task Creator</Link></li>
            <li>About</li>
            <li>Get Started</li>
            <li id='login'><a href='http://localhost:5001/auth/google'>Sign In</a></li>
          </ul>
        </nav>
        <div id='content'>
          <Switch>
            <Route path='/' exact component={Dashboard}/>
            <Route path='/task/:id/edit' component={Edit}/>
            <Route component={ErrorPage}/>
          </Switch>
        </div>
        <footer id='footer'>
            
        </footer>
      </div>
    );
  }
}

export default App;
