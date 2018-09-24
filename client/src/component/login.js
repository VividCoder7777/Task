import React from 'react';
import '../style/login.css';

export default class Login extends React.Component {

    render(){
        return (
            <div id='loginContainer'>
                <h3>Sign In</h3>
                <div>
                    <a id='google' href='http://localhost:5001/auth/google'>Google+</a>
                </div>
            </div>
        );
    }
}