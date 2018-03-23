import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import './index.css';
import logo from '../../images/logo.png';
import * as routes from '../../constants/routes';
import * as firebase from 'firebase';
import Spinner from '../Misc/Spinner'

class LandingPage extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            isAuthenticating: true
        }
    }    

    componentDidMount() {        
        this.authUser().then((user) => {
            this.setState({ isAuthenticating: false });
        }, (error) => {
            this.setState({ isAuthenticating: false });
            console.log(error);
        });
    }

    authUser() {
        var self = this;
        return new Promise(function (resolve, reject) {
            firebase.auth().onAuthStateChanged(function (authUser) {
                if (authUser) {
                    self.setState(() => ({ authUser }))
                    self.props.history.push(routes.HOME);
                    resolve(authUser);
                } else {
                    self.setState(() => ({ authUser: null }))
                    reject('User not logged in');
                }
            });
        });
    }
    
    render() {

        if (this.state.isAuthenticating)
            return (<div style={{ display: 'flex', justifyContent: 'center' }}> <Spinner /></div>);

        //If we're logged in, go to home page
        if (this.state.authUser != null) {
            this.props.history.push(routes.HOME);
        }

        return (
            <Row style={{marginTop: 100}}>
                <div className="center-block">
                    <Row>
                        <Col xs="auto">
                            <img id="login-img" src={logo} alt="" />
                        </Col>
                        <Col xs="6" id="login-right-panel">
                            <Row>
                                <h1 className="mt-5">Trekker</h1>
                                <p className="lead">Sign up to start discovering new places and sharing trips of your own.</p>
                            </Row>
                            <Row>
                                <Link to={routes.SIGN_IN} style={{ color: '#fff', width: '100%' }}>
                                    <Button color="primary" style={{ width: '100%' }}>Login</Button>
                                </Link>
                            </Row>
                            <hr />
                            <Row>
                                <p>Don't have an account? <Link to={routes.SIGN_UP}>Sign up</Link></p>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Row>
        );
    } 
}

export default withRouter(LandingPage);
