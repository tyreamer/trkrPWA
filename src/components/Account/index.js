import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap'
import PasswordChangeForm from './PasswordChange';
import UsernameChangeForm from './UsernameChange';
import withAuthorization from '../Session/withAuthorization';
import * as FontAwesome from 'react-icons/lib/fa'

const AccountPage = (props, { authUser }) => 
    <Container>
        <Row style={{ top: 0, backgroundColor: '#6db5ff' }}>
            <Col xs="12">
                <h3>
                    <FontAwesome.FaChevronLeft style={{ color: 'rgba(255,255,255, .6)' }} onClick={() => {                        
                            this.props.history.goBack()                        
                    }} />
                </h3>
            </Col>
        </Row>
        <Row>
            <Col xs="12" style={{ padding: 20, textAlign: 'center' }}>
                <h3>Account</h3>
            </Col>
        </Row>
        <hr/>
        <Row>          
            <Col style={{ textAlign: 'center', paddingTop: 50 }}>                
                <UsernameChangeForm />
                <h6>{authUser.email}</h6>
            </Col>
        </Row>
        <Row>
            <PasswordChangeForm />
        </Row>
    </Container>

AccountPage.contextTypes = {
  authUser: PropTypes.object,
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);