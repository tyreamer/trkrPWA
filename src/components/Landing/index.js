import React, { Component } from 'react';
import { Button } from 'reactstrap';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import './index.css';
import logo from '../../images/logo.png';
import * as routes from '../../constants/routes';
import { firebase } from '../../firebase';

class LandingPage extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            authUser: null
        }
    }    

    componentDidMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState(() => ({ authUser }))
                : this.setState(() => ({ authUser: null }));
        });
    }
    
    render() {

        //If we're logged in, go to home page
        if (this.state.authUser != null) {
            this.props.history.push(routes.HOME);
        }

        return (
            <div className="row">
                <div className="center-block">
                    <div className="row">
                        <div className="col-xs-6">
                            <img id="login-img" src={logo} alt="" />
                        </div>
                        <div className="col-xs-6" id="login-right-panel">
                            <div className="row">
                                <h1 className="mt-5">Trekker</h1>
                                <p className="lead">Sign up to start discovering new places and sharing trips of your own.</p>
                            </div>
                            <div className="row">
                                <Link to={routes.SIGN_IN} style={{ color: '#fff', width: '100%' }}>
                                    <Button color="primary" style={{ width: '100%' }}>Login</Button>
                                </Link>
                            </div>
                            <hr />
                            <div className="row">
                                <p>Don't have an account?</p> &ensp; <Link to={routes.SIGN_UP}>Sign up</Link>
                            </div>
                            <div className="row">
                                <Link to={routes.PASSWORD_FORGET}>Forgot password?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } 
}

export default withRouter(LandingPage);
