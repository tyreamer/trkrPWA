import React, { Component } from 'react';

import * as firebase from 'firebase';
import classnames from 'classnames';
import * as routes from '../../../constants/routes';
import {    withRouter  } from 'react-router-dom';
import * as FontAwesome from 'react-icons/lib/fa'
import { Container, Row, Col, Button, TabPane, NavLink, NavItem, Nav, TabContent } from 'reactstrap'
import TrekDetail from '../../TrekDetail'
//import TipDetail from '../../TipDetail.js'

class MainProfile extends Component {

    constructor(props) {
        super(props);
        this.removeTrek = this.removeTrek.bind(this)
        this.toggle = this.toggle.bind(this);
    }

    state = {
        treks: [],
        resources: [],
        tips: [],
        currentView: '',
        loadingNewPhoto: false,
        user: this.props.location.state.user,
        activeTab: '1'
    }
    
    componentWillMount() {
        var self = this
        
        //this.setState({ userPhoto: this.props.user.photo != null ? this.props.user.photo : '' })      

        var myTreks = []
        if (this.state.user !== undefined) {
            firebase.database().ref('/user-posts').child(this.state.user).once('value')
                .then(function (snapshot) {
                    snapshot.forEach(function (child) {
                        myTreks.unshift({ id: child.key, details: child.val() })
                    })
                })
                .then(() => self.setState({ treks: myTreks }))
                .catch((e) => console.log('Fetch Error (treks): ' + e))
        }               
    }

    componentDidMount() {
        var self = this

        var myResources = [];
        firebase.database().ref('/user-resources').child(this.state.user).once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (child) {
                    myResources.unshift(child.val())
                })
            })
            .then(() => self.setState({ resources: myResources }))
            .catch((e) => console.log('Fetch Error (resources): ' + e))

        var myTips = [];
        firebase.database().ref('/user-tips').child(this.state.user).once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (child) {
                    myTips.unshift(child.val())
                })
            })
            .then(() => self.setState({ tips: myTips }))
            .catch((e) => console.log('Fetch Error (tips): ' + e))
    }

    removeTrek(key) {
        var $idx;
        for (var i = 0; i < this.state.treks.length; i++) {
            if (this.state.treks[i].id == key) {
                $idx = i;
                break;
            }
        }

        var newTrekList = this.state.treks;
        newTrekList.splice(i, 1);
        this.setState({ treks: newTrekList })
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    createTrekList() {
        var list = []
        var self = this
        if (this.state.treks != undefined) {
            this.state.treks.forEach(function (trek) {
                list.push(<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 50 }} key={trek.id}> <TrekDetail id={trek.id} trekRecord={trek.details} handleDeletedTrek={self.removeTrek} /></div>)
            })

            if (list.length === 0) {
                return (<p style={{ fontSize: 20 }}>no plans yet!</p>)
            }
            else {
                return list;
            }
        }
    }

    createResourceList() {
        var list = []
        var self = this
        if (this.state.resources != undefined) {
            this.state.resources.forEach(function (resource) {
                var date = new Date(resource.datePosted);
                date = (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());

                list.push(<Container style={{ width: '100%' }} key={resource.link + resource.datePosted}>
                            <Row onClick={() => { window.open(resource.link) }}>
                                <Col xs="10">                                    
                                    <p><b>{resource.resourceTitle}</b></p>
                                    <p><small>{resource.resourceSummary}</small></p>
                                    
                                </Col>
                                <Col xs="2">   
                                    <FontAwesome.FaExternalLink name="ios-link"  />
                                </Col>
                            </Row>
                        </Container>)
            })

            if (list.length === 0) {
                return (<p>no resources yet!</p>)
            }
            else {
                return list;
            }
        }
    }

    createTipsList() {
        var list = []
        var self = this

        if (this.state.tips != undefined) {
            for (var i = this.state.tips.length - 1; i >= 0; i--) {
                //list.push(<TipDetail tip={this.state.tips[i]} />)
            }


            if (list.length === 0) {
                return (<Container style={{ flexDirection: 'column', marginTop: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <Row>
                        <h2><FontAwesome.FaLightbulbO /></h2>
                    </Row>
                    <Row>
                        <p style={{ fontSize: 20 }}>no tips yet!</p>
                    </Row>
                </Container>)
            }
            else {
                return list;
            }
        }
    }

    generateContent() {

        return (
            <div style={{ width: '100%' }}>
                <Row tabs style={{ textAlign: 'center' }}>
                    <Col xs="4">
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
                            Treks
                        </NavLink>
                    </Col>
                    <Col xs="4">
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
                            Resources
                        </NavLink>
                    </Col>
                    <Col xs="4">
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>
                            Tips
                        </NavLink>
                    </Col>
                </Row>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        {this.createTrekList()}
                    </TabPane>
                    <TabPane tabId="2">
                        {this.createResourceList()}
                    </TabPane>
                    <TabPane tabId="3">
                        {this.createTipsList()}}
                    </TabPane>
                </TabContent>
            </div>);
    }


    render() {

        if (this.state.user === undefined) return null

        return (<div>
                    <Row>
                        <Col xs="3" style={{ paddingTop: 15 }}> 
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FontAwesome.FaExternalLink style={styles.headerIconStyle} />                    
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}> {this.state.resources.length} </p>  
                            </div>
                        </Col>
                        <Col xs="3" style={{ paddingTop: 15 }}>      
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FontAwesome.FaLightbulbO style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}>{this.state.tips.length}</p>                       
                            </div>
                        </Col>
                        <Col xs="3" style={{ paddingTop: 15 }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FontAwesome.FaPlane style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}>{this.state.treks.length}</p>                       
                            </div>
                        </Col>
                        <Col xs="3" style={{ paddingTop: 15 }}>  
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <FontAwesome.FaGroup style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}>0</p>                
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" style={{ height: 150 }}>
                            <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 5, paddingTop: 20 }}>
                                <center><FontAwesome.FaUser size={70}  /></center>
                                {/*this.state.loadingNewPhoto ? <p> Loading... </p> : this.renderProfilePicture()*/}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {this.generateContent()}
                    </Row>
                </div>
        );
    }
}


const styles = {
    invisible:
    {
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)'
    },
    fullHeight:
    {
        height: '100%'
    },
    headerTextStyle:
    {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    headerIconStyle:
    {
        color: 'rgba(0,0,0,.6)',
        fontSize: 20,
        alignSelf: 'center'
    },
    headerButtonStyle:
    {
        flexDirection: 'column'
    },
    ThumbnailStyle:
    {
        height: 120,
        width: 120,
        borderRadius: 100,
        zIndex: 20
    }
}

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

export default withRouter(MainProfile);