import React, { Component } from 'react';

import * as firebase from 'firebase';
import * as FontAwesome from 'react-icons/lib/fa'
import { Container, Row, Col, Button } from 'reactstrap'
import * as routes from '../../../constants/routes';

import {
  Link,
  withRouter,
} from 'react-router-dom';

class HeaderBar extends Component {

    constructor(props) {
        super(props)
        this.signOut = this.signOut.bind(this)
    }

    signOut() {
        console.log('here')
        firebase.auth().signOut()
            .then(() => {
                this.props.history.push(routes.LANDING)
            })
            .catch((e) => { console.log('Sign-Out Exception: ' + e) })
    }

    render() {        
        return (
            <Row style={{ backgroundColor: '#fff' }}>
                <Col xs="9">
                    <h5 style={{ marginLeft: 5, marginTop: 10 }}><b> {this.props.location.state.user}</b></h5>
                </Col>
                <Col xs="3">
                    <div onClick={() => { this.signOut() }} style={{ marginTop: 10, float: 'right' }}>
                        <FontAwesome.FaSignOut size={30} />
                    </div>
                </Col>
            </Row>
        );
    }
}

export default withRouter(HeaderBar);