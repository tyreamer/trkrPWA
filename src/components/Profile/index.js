import React, { Component } from 'react';

import { Container } from 'reactstrap';
import withAuthorization from '../Session/withAuthorization'
import HeaderBar from './HeaderBar'
import MainProfile from './MainProfile'

class ProfilePage extends Component {
    
    render() {
        return (
            <Container>
                <HeaderBar />  
                <MainProfile />                
            </Container>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);