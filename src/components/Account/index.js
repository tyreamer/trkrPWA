import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap'
import PasswordChangeForm from './PasswordChange';
import UsernameChangeForm from './UsernameChange';
import withAuthorization from '../Session/withAuthorization';
import * as FontAwesome from 'react-icons/lib/fa'
import * as constants from '../../constants';
import { Link } from 'react-router-dom'
import { auth } from '../../firebase'

const AccountPage = (props, { authUser }) => 
    <Container>
        <Row style={{ top: 0, }}>
            <Col xs="4">
                <Link style={{ margin: '0 auto' }} to={{ pathname: constants.routes.PROFILE, state: { user: auth.currentUser() } }}>
                    <h3 >
                        <FontAwesome.FaChevronLeft style={{ color: '#fff' }} />
                    </h3>
                </Link>
            </Col>
            <Col xs="4" style={{ paddingBottom: 20, textAlign: 'center', color: '#fff' }}>
                <h3>Account</h3>
            </Col>
        </Row>
        <Row style={{ color: '#fff' }}>   
            <Col>
                <h6><center>{authUser.email}</center></h6>
            </Col>
        </Row>
        <Row style={{ color: '#fff', boxShadow: '0 2px 2px -2px #f8f8f8', paddingBottom: 15, marginBottom: 20 }}>
            <Col>
                <center>
                {auth.userIsVerified()
                    ?
                    <h6>account verified <FontAwesome.FaCheck style={{ color: '#5cb85c', paddingBottom: 5 }} /></h6>
                    :
                    <h4 style={{ backgroundColor: '#fff', color: '#d9534f' }}> not yet verified <FontAwesome.FaTimesCircle style={{ backgroundcolor: '#fff', paddingBottom: 5 }} /></h4>
                }
                </center>
            </Col>
        </Row>
        <Row style={{color: '#fff'}}>  
            <UsernameChangeForm />
        </Row>
        <Row style={{ color: '#fff' }}>
            <PasswordChangeForm />
        </Row>
    </Container>

AccountPage.contextTypes = {
  authUser: PropTypes.object,
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);