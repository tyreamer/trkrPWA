import React, { Component } from 'react';

import { Container } from 'reactstrap';
import withAuthorization from '../Session/withAuthorization'
import MainProfile from './MainProfile'

class ProfilePage extends Component {
    
    render() {
        return (
            <Container>
                <MainProfile />                
            </Container>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);