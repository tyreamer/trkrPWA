import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as FontAwesome from 'react-icons/lib/fa'
import * as IonIcon from 'react-icons/lib/io'
import * as constants from '../../../constants';
import * as helpers from '../../../helpers';
//import DynamicGMap from '../../DynamicGMap'
import StaticGMap from '../../StaticGMap'
import Spinner from '../../Misc/Spinner'
import { Container, Row, Col } from 'reactstrap'


class MainViewTrek extends Component {
    
    componentWillMount() {      
        if (this.props !== undefined) {
            if (this.props.location !== undefined) {
                if (this.props.location.state !== undefined) {
                    if (this.props.location.state.trek !== undefined) {
                        this.setState({ trek: this.props.location.state.trek })
                        return;
                    }
                }
            }
        }

        this.setState({ trek: null })
    }

    renderDays() {   
        
        var days = []

        if (days !== undefined) {
            for (var i = 0; i < this.state.trek.days.length; i++) {
                days.push(
                    <Container style={{ marginTop: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0 }} key={"Day" + i + 1}>
                        <Row style={{ backgroundColor: '#f8f8f8', color: '#787878' }}>
                            <Col xs="12">
                                <h4>day {i + 1}</h4>
                            </Col>
                        </Row>
                        {this.renderStops(this.state.trek.days[i]) }
                    </Container >
                );
            }
        }

        return days;
    }

    renderStops(day) {        
        var stops = []
        
        if (day.stops !== undefined) {
            for (var i = 0; i < day.stops.length; i++) {
                stops.push(
                    <div key={day.stops[i].stopName + i} style={{ paddingTop: 10 }} className="clearfix">
                        {
                            i !== day.stops.length - 1
                            ?
                                (<div style={{ position: 'relative', left: 0, top: 0, zIndex: 1}}>
                                    <svg style={{ position: 'absolute', top: 0, left: -8, zIndex: 1 }} >
                                        <line className="markerLine" x1="20" x2="20" y1="20" y2="100" stroke="#c9f4ff" strokeWidth="5" strokeDasharray="3, 4" />
                                    </svg>
                                </div>)
                            :
                            null
                        }
                        <Row>
                            <Col xs="2">
                                <h4 style={{ position: 'absolute', zIndex: 15 }}>
                                    <IonIcon.IoAndroidPin style={{ color: '#' + helpers.getColorFromString(day.stops[i].stopName).substring(2) }} />
                                </h4>                                
                            </Col>
                            <Col xs="10">
                                <h6 style={{ fontWeight: 'normal', paddingTop: 10 }}>{day.stops[i].stopName}</h6>
                            </Col>
                        </Row>                        
                        <br/>
                    </div>
                );
            }
        }
        return stops;
    }

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return 0;
    }

    render() {

        if (this.state.trek === null || this.state.trek === undefined) return <Spinner />;
        var trek = this.state.trek;

        var budget = this.formatNumber(trek.budget)
        //stops
        var totalStops = 0;
        if (trek.days !== undefined && trek.days !== null) {
            for (var i = 0; i < trek.days.length; i++) {
                if (trek.days[i].stops !== undefined && trek.days[i].stops !== null) {
                    totalStops = totalStops + trek.days[i].stops.length
                }
            }
        }

        //date
        var date = new Date(trek.datePosted);
        date = ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
        
        return (
            <Container>
                <Row style={{ position: 'sticky', top: 0, backgroundColor: '#6db5ff' }}>
                    <Col xs="12">
                        <h3 style={{ float: 'left'}}>
                            <FontAwesome.FaChevronLeft style={{ color: '#fff' }} onClick={() => {
                                    this.props.history.goBack()
                            }} />                            
                        </h3>
                        <h3 style={{ color: '#fff', float: 'right' }}>
                            <FontAwesome.FaBookmarkO onClick={() => { window.confirm('Save trip?') }} />
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Container>
                        <Row style={{ backgroundColor: '#6db5ff' }}>
                            <Col xs="12">
                                <center> <p style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>{trek.title}</p> </center>
                            </Col>
                        </Row>
                        <Row style={{ color: '#fff', backgroundColor: 'rgba(109,181,255, .8)', paddingBottom: 5 }}>
                            <Col xs="3" style={styles.HeaderColStyle}>
                                <h5 style={{ display: 'inline' }}><FontAwesome.FaCalendarO /></h5>
                                <h6 style={{ display: 'inline' }}> {trek.days.length}</h6>
                            </Col>
                            <Col xs="6" style={styles.HeaderColStyle}>
                                <h5 style={{ display: 'inline' }}><FontAwesome.FaDollar /></h5>
                                <h6 style={{ display: 'inline' }}> {budget}</h6>
                            </Col>
                            <Col xs="3" style={styles.HeaderColStyle}>
                                <h5 style={{ display: 'inline'}}><FontAwesome.FaMapPin /></h5>
                                <h6 style={{ display: 'inline' }}>  {totalStops}</h6>
                            </Col>
                        </Row>
                        <Row style={{padding: 0}}>
                            <StaticGMap trekDays={trek.days} size="5000x300" />
                        </Row>
                        <Row style={{ paddingTop: 5 }}>
                            <Col xs="2">
                                <h4><FontAwesome.FaMapO style={{ color: '#6db5ff'}} /></h4>
                            </Col>
                            <Col xs="10">                            
                                {trek.summary === null || trek.summary === "" ? null : <p>{trek.summary}</p>}
                            </Col>
                        </Row>
                    </Container>
                </Row>                
                {this.renderDays()}
                <Row style={{ backgroundColor: '#f8f8f8', paddingTop: 10 }}>
                    <Col xs="12">
                        <p style={{ textAlign: 'right', lineHeight: .9, overflowX: 'auto', overflowY: 'hidden' }}
                            onClick={() => {
                                this.props.history.push({ pathname: constants.routes.PROFILE, state: { user: trek.user === null ? '' : trek.user } })
                            }}>
                            <small>
                                posted by: <b>{trek.user}</b>
                                <br />
                                {date}
                            </small>
                        </p>
                    </Col>
                </Row>
        </Container>
    )
    }
}

const styles = {
    headerTextStyle: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingRight: 20
    },
    HeaderColStyle: {
        textAlign: 'center'
    },
    headerButtonStyle: {
        flexDirection: 'column'
    },
    CardElevatedStyle:
    {
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.6,
        paddingRight: 0
    },
    CardTextStyle:
    {
        fontSize: 25,
        color: '#fff',
        paddingLeft: 5
    },
    CardIconStyle:
    {
        color: '#fff',
        fontSize: 15,
    },
    GridColStyle:
    {
        flexDirection: 'row',
        alignItems: 'center',
    }
}

export default withRouter(MainViewTrek);
