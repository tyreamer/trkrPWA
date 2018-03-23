import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap'
import * as firebase from 'firebase'
import * as FontAwesome from 'react-icons/lib/fa'

import SignOutButton from '../SignOut';
import * as routes from '../../constants/routes';

const Navigation = (props, { authUser }) => 

    <Container style={{ position: 'fixed', bottom: 0, height: '56px' }}>
        {
            authUser
                ? <NavigationAuth />
                : <NavigationNonAuth />
        }
    </Container>


Navigation.contextTypes = {
  authUser: PropTypes.object,
};

const NavigationAuth = () => {

    return (
        <Row>
            <Col xs="4" style={styles.NavigationStyle}>
                <Link style={{ color: 'lightgrey' }} to={routes.HOME}>
                    <FontAwesome.FaHome style={styles.IconStyle} />
                </Link>
            </Col>
            <Col xs="4" style={styles.NavigationStyle}>
                <Link style={{ color: 'lightgrey' }} to={{ pathname: routes.CREATE }}>
                    <FontAwesome.FaPlusSquare style={styles.IconStyle} />
                </Link>
            </Col>
            <Col xs="4" style={styles.NavigationStyle}>
                {
                    firebase.auth().currentUser !== null
                    ?
                        <Link style={{ color: 'lightgrey' }} to={{ pathname: routes.PROFILE, state: { user: firebase.auth().currentUser.displayName }  }}>
                        <FontAwesome.FaUser style={styles.IconStyle} />
                    </Link>
                    :
                    null
                }                
            </Col>
        </Row>)
}

const styles = {
    NavigationStyle: {
        padding: 0, 
        paddingTop: 10,           
        textAlign: 'center',
        height: '56px',    
        backgroundColor: '#fff',
        color: 'lightgrey'
    },
    IconStyle: {
        fontSize: '30px'
    }
}

const NavigationNonAuth = () => null

export default Navigation;
