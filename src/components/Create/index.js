import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { Link } from 'react-router-dom'
import { Container, Row, Button } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import * as constants from '../../constants';

class CreatePage extends Component {
    
    render() {
        return (
            <div style={{ marginTop: '10%'}}>
                <Row>
                    <Link to={constants.routes.CREATE_TRIP} style={{ color: '#fff', width: '100%' }}>
                        <Button color="link" style={{ ...styles.CreateButtonStyle, ...styles.CreateButton1 }}>
                            <FontAwesome.FaPlane style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }}/>
                            <p style={{ color: '#fff' }}>Plan a new trip</p>
                        </Button>
                    </Link>
                </Row>
                <Row>
                    <Link to={constants.routes.CREATE_RESOURCE} style={{ color: '#fff', width: '100%' }}>
                        <Button color="link" style={{ ...styles.CreateButtonStyle, ...styles.CreateButton2 }}>
                            <FontAwesome.FaExternalLink style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            <p style={{ color: '#fff' }}>Share a link</p>
                        </Button>
                    </Link>
                </Row>
                <Row>
                    <Link to={constants.routes.CREATE_TIP} style={{ color: '#fff', width: '100%' }}>
                        <Button color="link" style={{ ...styles.CreateButtonStyle, ...styles.CreateButton3 }}>
                            <FontAwesome.FaLightbulbO style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            <p style={{ color: '#fff' }}>Share a tip</p>
                        </Button>
                    </Link>
                </Row>
            </div>
        );
    }
}

const styles = {
    CreateButtonStyle: {
        height: 100,
        width: '100%',
        alignContent: 'center',
        marginBottom: 15
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