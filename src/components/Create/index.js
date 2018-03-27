import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { Link } from 'react-router-dom'
import { Container, Row, Button } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import logo from '../../images/logo.png';
import * as constants from '../../constants';

class CreatePage extends Component {
    
    render() {
        return (
            <Container style={{height: '100%'}}>
                <Row>
                    <Link to={constants.routes.CREATE_TRIP} style={{ color: '#fff', width: '100%' }}>
                        <Button style={{ ...styles.CreateButtonStyle, ...styles.CreateButton1 }}>
                            <FontAwesome.FaPlane style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }}/>
                            <p style={{ color: '#fff' }}>Plan a new trip</p>
                        </Button>
                    </Link>
                </Row>
                <Row>
                    <Link to={constants.routes.CREATE_RESOURCE} style={{ color: '#fff', width: '100%' }}>
                        <Button style={{ ...styles.CreateButtonStyle, ...styles.CreateButton2 }}>
                            <FontAwesome.FaExternalLink style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            <p style={{ color: '#fff' }}>Share a resource</p>
                        </Button>
                    </Link>
                </Row>
                <Row>
                    <Link to={constants.routes.CREATE_TIP} style={{ color: '#fff', width: '100%' }}>
                        <Button style={{ ...styles.CreateButtonStyle, ...styles.CreateButton3 }}>
                            <FontAwesome.FaLightbulbO style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            <p style={{ color: '#fff' }}>Share a tip</p>
                        </Button>
                    </Link>
                </Row>
            </Container>
        );
    }
}

const styles = {
    CreateButtonStyle: {
        height: 100,
        width: '100%',
        alignContent: 'center',
        borderColor: '#fff'
    },
    CreateButton1: {
        backgroundColor: '#5b4fff' 
    },
    CreateButton2: {
        backgroundColor: '#ff8142'
    },
    CreateButton3: {
        backgroundColor: '#ff5858'
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CreatePage);