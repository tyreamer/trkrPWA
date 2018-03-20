import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap'
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';

const AccountPage = (props, { authUser }) => 
    <Container>
        <Row>
            <Col style={{ textAlign: 'center', paddingTop: 50 }}>
                <h6>{authUser.displayName}</h6>
                <h6>{authUser.email}</h6>
            </Col>
        </Row>
        <hr />
        <Row>
            <PasswordForgetForm />
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