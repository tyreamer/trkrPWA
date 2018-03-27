import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap'
import * as firebase from 'firebase'
import * as FontAwesome from 'react-icons/lib/fa'

import * as constants from '../../constants';

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
                <Link to={constants.routes.HOME}>
                    <FontAwesome.FaHome style={styles.IconStyle} />
                </Link>
            </Col>
            <Col xs="4" style={styles.NavigationStyle}>
                <Link to={{ pathname: constants.routes.CREATE }}>
                    <FontAwesome.FaPlusSquare style={styles.IconStyle} />
                </Link>
            </Col>
            <Col xs="4" style={styles.NavigationStyle}>
                {                   
                    firebase.auth().currentUser !== null
                    ?
                        <Link to={{ pathname: constants.routes.PROFILE, state: { user: firebase.auth().currentUser.displayName }  }}>
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
        backgroundColor: '#6db5ff'
    },
    IconStyle: {
        fontSize: '30px',
        color: '#fff'
    }
}

const NavigationNonAuth = () => null

export default Navigation;
