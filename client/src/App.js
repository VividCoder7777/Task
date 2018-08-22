import React, { Component } from 'react';
import './App.css';
import './style/main.css';
import {Link, Route} from 'react-router-dom';
import Dashboard from './component/dashboard';
import Edit from './component/edit';

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
        <Route path='/' exact component={Dashboard}/>
        <Route path='/task/:id/edit' component={Edit}/>
      </div>
    );
  }
}

export default App;
