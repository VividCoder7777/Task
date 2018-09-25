import React, { Component } from 'react';
import './App.css';
import './style/main.css';
import {Switch, Link, Route, Redirect} from 'react-router-dom';
import Dashboard from './component/dashboard';
import Edit from './component/edit';
import ErrorPage from './component/error';
import Login from './component/login';
import Home from './component/home/home';
import Env from './utility/envVariables';

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

// The main container
class App extends Component {

  constructor(props){
    super(props);
  }

  isAuthenticated(){
    let auth = getCookie('login');

    if (auth){
      return true;
    } else {
      return false;
    }
  }

  render() {

    return (
      <div className="App">
        <nav className='nav'>
          <ul id='flexNav'>
            <li><Link to='/'>Get more done with Task Creator</Link></li>
            <li>About</li>
            <li>Get Started</li>
            <li><Link to='/dashboard'>Dashboard</Link></li>
            {this.isAuthenticated() ? (<li id='login'><a href= {Env.SERVER + 'auth/logout'}>Sign Out</a></li>) : 
                                      (<li id='login'><Link to='/login'>Sign In</Link></li>)}
            
          </ul>
        </nav>
        <div id='content'>
       
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/dashboard'  render={(props)=>{
              if (this.isAuthenticated()){
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
