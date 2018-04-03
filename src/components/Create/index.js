import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { Link } from 'react-router-dom'
import { Row, Button } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import * as constants from '../../constants';
import './index.css'

class CreatePage extends Component {
    
    render() {
        return (
            <div style={{ marginTop: '10%'}}>
                <Row>
                    <Link to={constants.routes.CREATE_TRIP} style={{ color: '#fff', width: '100%' }}>
                        <Button id="create-trip-button" color="link" style={{ ...styles.CreateButtonStyle }}>
                            <h4 style={{ color: '#fff' }}> 
                                Plan a new trip &nbsp;
                                <FontAwesome.FaPlane size={35} style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            </h4>
                        </Button>
                    </Link>
                </Row>
                <Row>
                    <Link to={constants.routes.CREATE_RESOURCE} style={{ color: '#fff', width: '100%' }}>
                        <Button id="create-resource-button" color="link" style={{ ...styles.CreateButtonStyle }}>
                            <h4 style={{ color: '#fff' }}>                                
                                Share a link &nbsp;
                                <FontAwesome.FaExternalLink size={35} style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            </h4>
                        </Button>
                    </Link>
                </Row>
                <Row>
                    <Link to={constants.routes.CREATE_TIP} style={{ color: '#fff', width: '100%' }}>
                        <Button id="create-tip-button" color="link" style={{ ...styles.CreateButtonStyle }}>
                            <h4 style={{ color: '#fff' }}> 
                                Share a tip &nbsp;
                                <FontAwesome.FaLightbulbO size={35} style={{ paddingLeft: 10, fontSize: 30, color: '#fff' }} />
                            </h4>
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
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CreatePage);