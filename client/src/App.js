import React, { Component } from 'react';
import './App.css';
import './style/main.css';
import {Switch, Link, Route, Redirect} from 'react-router-dom';
import Dashboard from './component/dashboard';
import Edit from './component/edit';
import ErrorPage from './component/error';
import Login from './component/login';

// The main container
class App extends Component {

  constructor(props){
    super(props);
    this.state = {isLoggedIn: false};
  }

  componentDidMount(){
    let isLoggedIn = document.cookie;
    console.log(isLoggedIn);
  }

  render() {

    return (
      <div className="App">
        <nav className='nav'>
          <ul id='flexNav'>
            <li><Link to='/'>Get more done with Task Creator</Link></li>
            <li>About</li>
            <li>Get Started</li>
            <li id='login'><Link to='/login'>Sign In</Link></li>
          </ul>
        </nav>
        <div id='content'>
          <Switch>
            <Route path='/' exact render={(props) => {
              if (this.isLoggedIn){
                return <Dashboard {...props}/>
              } else {
                return <Redirect to='/login'/>
              }
            }}/>
            <Route path='/login' component={Login}/>
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
