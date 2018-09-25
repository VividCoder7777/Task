import React from 'react';
import '../style/login.css';
import Env from '../utility/envVariables';

export default class Login extends React.Component {

    render(){
        return (
            <div id='loginContainer'>
                <h3>Sign In</h3>
                <div>
                    <a id='google' href={Env.SERVER + 'auth/google'}>Google+</a>
                </div>
            </div>
        );
    }
}