import React, { Component } from 'react';

import * as firebase from 'firebase';
import * as FontAwesome from 'react-icons/lib/fa'
import { Row, Col } from 'reactstrap'
import * as routes from '../../../constants/routes';

import {  withRouter  } from 'react-router-dom';

class HeaderBar extends Component {

    constructor(props) {
        super(props)
        this.signOut = this.signOut.bind(this)
    }

    signOut() {
        if (window.confirm('Are you sure you want to sign out?')) {
            firebase.auth().signOut()
                .then(() => {
                    this.props.history.push(routes.LANDING)
                })
                .catch((e) => { console.log('Sign-Out Exception: ' + e) })
        }       
    }

    render() {        
        return (
            <Row style={{ backgroundColor: '#fff', paddingTop: 20, paddingBottom: 20, boxShadow: '0 5px 2px -2px #f8f8f8' }}>
                <Col xs="8">
                    <h5 style={{ marginLeft: 5 }}><b> {this.props.location.state.user}</b></h5>
                </Col>
                <Col xs="4" style={{paddingRight: 0 }}>                    
                    {
                        firebase.auth().currentUser.displayName === this.props.location.state.user
                            ?
                            <div>
                                <div onClick={() => { this.signOut() }} style={{ float: 'right', display: 'inline' }}>
                                    <FontAwesome.FaSignOut size={30} />
                                </div>
                                <div onClick={() => { this.props.history.push(routes.ACCOUNT) }} style={{ float: 'right', display: 'inline', paddingRight: 15 }}>
                                    <FontAwesome.FaCog size={30} />
                                </div>
                            </div>
                        :
                        null
                    }
                </Col>
            </Row>
        );
    }
}

export default withRouter(HeaderBar);