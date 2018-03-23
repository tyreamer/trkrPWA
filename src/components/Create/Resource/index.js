import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { Container, Col, Row, Button, Form, FormGroup, Input } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import * as routes from '../../../constants/routes';
import TagList from '../../TagList'
import * as firebase from 'firebase'

class CreateResourcePage extends Component {
    
    render() {
        return (
            <Container>
               CreateResource
            </Container>
        );
    }
}

export default withRouter(CreateResourcePage);