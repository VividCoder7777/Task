import React from 'react';

export default class Login extends React.Component {


    render(){
        return (
            <div>
                Cookies are:
                {document.cookie}
                <h3>Sign In</h3>
                <a href='http://localhost:5001/auth/google'>Google+</a>
            </div>
        );
    }
}