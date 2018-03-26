import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import {storage} from 'helpers';
import notify from 'helpers/notify'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl';
import { LoginForm } from 'components';

// socket
import sender from 'socket/packetSender';

import './Login.scss';

const messages = defineMessages({
    greeting: {
        id: "Login.notify.greeting",
        defaultMessage: "Hello, {name}!"
    },
    failure: {
        id: "Login.notify.failure",
        defaultMessage: "Incorrect username or password"
    },
    regexFailure: {
        id: "Login.notify.regexFailure",
        defaultMessage: "Please check your username or password"
    }
})

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animate: false,
            leave: false,
            path: ''
        };
    }


    handleChange = (e) => {
        const { FormActions } = this.props;
        FormActions.changeInput({form: 'login', name: e.target.name, value: e.target.value})
    }


    leaveTo = ({
        path,
        express = false
    }) => {
        this.setState({animate: true, path});

        if (express) {
            alert('express in');
            // if (process.env.NODE_ENV === 'development') {
            //     document.location.href = "http://18.217.245.201:3000" + path;
            // } else {
            //     document.location.href = path;
            // }
            document.location.href = path;
            return;
        }
        setTimeout(() => this.setState({leave: true}), 700)
    }

    connectToChatRoom = () => {
        const { status } = this.props;
       
        const { sessionID } = status.session;
        sender.auth(sessionID, false);
    }
    
    handleSubmit = async (e) => {
        
        e.preventDefault();

        const { form, AuthActions } = this.props;
        const { username, password } = form;

        notify.clear();

        const regex = /^[0-9a-zA-Z]{4,30}$/;

        if (!(regex.test(username) && regex.test(password))) {
            notify({type: 'error', message: "Incorrect username or password"});
            return;
        }

        AuthActions.setSubmitStatus(true);

        try {
            await AuthActions.localLogin({displayName:username, password});
        } catch (e) {
            notify({type: 'error', message: "Incorrect username or password"});
            AuthActions.setSubmitStatus(false);
            return;
        }

        // Redirect

        notify({type: 'success', message: `Hello, ${username}!`});

        this.connectToChatRoom();
        
        AuthActions.setSubmitStatus(false);

    }


    render() {

        const { handleChange, handleSubmit, handleKeyPress } = this;
        const { form, status } = this.props;

        return (
            <div className='card rounded-2 loginform_bkg'>
                <div className='card-header'>
                <p className='text-center mb-0 already'>Already have an account?</p>
                <h3 className="mb-0 text-center text-white">Login from here</h3>
                </div>
                <div className="card-body">
                    
                    <LoginForm 
                        form={form} 
                        status={status}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        />
                    <div className="row mt-3 text-center">
                        <p className="w-100">
                            <span className="color-grey"> New User? </span>
                            <Link className="color-yellow" to="/signup">
                            Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this
            .props
            .FormActions
            .formReset();
    }
}

export default Login;