import React, { Component } from 'react';

import * as firebase from 'firebase';
import { db } from '../../../firebase';
import classnames from 'classnames';
import * as routes from '../../../constants/routes';
import {    withRouter  } from 'react-router-dom';
import * as FontAwesome from 'react-icons/lib/fa'
import FileUploader from 'react-firebase-file-uploader';
import { Container, Row, Col, Button, TabPane, NavLink, NavItem, Nav, TabContent } from 'reactstrap'
import './index.css'
import Spinner from '../../Misc/Spinner'
import TipDetail from '../../TipDetail'
import TrekDetail from '../../TrekDetail'
import ResourceDetail from '../../ResourceDetail'

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
        loading: true,
        user: this.props.location.state.user,
        activeTab: '1'
    }
    
    componentWillMount() {
        var self = this

        if (this.state.user === undefined) {
            this.setState({ user: firebase.auth().currentUser.displayName  })
        }
       
        var myTreks = []
        if (this.state.user !== undefined && this.state.user !== null) {
            console.log(this.state.user)
            //retrieve posts
            firebase.database().ref('/user-posts').child(this.state.user).once('value')
                .then(function (snapshot) {
                    snapshot.forEach(function (child) {
                        myTreks.unshift({ id: child.key, details: child.val() })
                    })
                })
                .then(() => self.setState({ treks: myTreks, loading: false }))
                .catch((e) => console.log('Fetch Error (treks): ' + e))

            //retrieve photo
            firebase.database().ref('/users').child(this.state.user).once('value')
                .then(function (snapshot) {
                    if (snapshot.hasChild('photo')) {
                        self.setState({ userPhoto: snapshot.child('photo').val() })
                    }
                })
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
        var idx;
        for (var i = 0; i < this.state.treks.length; i++) {
            if (this.state.treks[i].id === key) {
                idx = i;
                break;
            }
        }

        var newTrekList = this.state.treks;
        newTrekList.splice(idx, 1);
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
        var self = this;

        if (this.state.treks !== undefined) {
            this.state.treks.forEach(function (trek) {
                  list.push(<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 50 }} key={trek.id}>
                                <TrekDetail id={trek.id} trekRecord={trek.details} handleDeletedTrek={self.removeTrek} />
                            </div>)
            })

            if (list.length === 0) {
                return (<Container style={{ padding: 75, alignItems: 'center', justifyContent: 'center' }}>
                    <Row>
                        <h2 style={{ fontSize: 20, margin: '0 auto' }}><FontAwesome.FaLightbulbO /></h2>
                    </Row>
                    <Row>
                        <p style={{ fontSize: 20, margin: '0 auto' }}>no plans yet!</p>
                    </Row>
                </Container>)
            }
            else {
                return list;
            }
        }
    }

    createResourceList() {
        var list = []
        if (this.state.resources !== undefined) {
            this.state.resources.forEach(function (resource) {
                var date = new Date(resource.datePosted);
                date = (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());

                list.push(<ResourceDetail resource={resource} />)
            })

            if (list.length === 0) {
                return (<Container style={{ padding: 75, alignItems: 'center', justifyContent: 'center' }}>
                    <Row>
                        <h2 style={{ fontSize: 20, margin: '0 auto' }}><FontAwesome.FaLightbulbO /></h2>
                    </Row>
                    <Row>
                        <p style={{ fontSize: 20, margin: '0 auto' }}>no resources yet!</p>
                    </Row>
                </Container>)
            }
            else {
                return list;
            }
        }
    }

    createTipsList() {
        var list = []

        if (this.state.tips !== undefined) {
            for (var i = this.state.tips.length - 1; i >= 0; i--) {
                list.push(<TipDetail tip={this.state.tips[i]} />)
            }


            if (list.length === 0) {
                return <Container style={{padding: 75, alignItems: 'center', justifyContent: 'center' }}>
                            <Row>
                                <h2 style={{ fontSize: 20, margin: '0 auto' }}><FontAwesome.FaLightbulbO /></h2>
                            </Row>
                            <Row>
                                <p style={{ fontSize: 20, margin: '0 auto' }}>no tips yet!</p>
                            </Row>
                        </Container>
            }
            else {
                return list;
            }
        }
    }

    generateContent() {

        return (
            <div style={{ width: '100%' }}>
                <Row style={{ textAlign: 'center', fontWeight: 'bold', color: 'grey', boxShadow: '0 10px 2px -2px #f8f8f8', height: 50 }}>
                    <Col xs="4" className={classnames({ active: this.state.activeTab === '1' })}>
                        <NavLink onClick={() => { this.toggle('1'); }}>
                            <FontAwesome.FaPlane style={{fontSize: 25 }}/>
                        </NavLink>
                    </Col>
                    <Col xs="4" className={classnames({ active: this.state.activeTab === '2' })}>
                        <NavLink onClick={() => { this.toggle('2'); }}>
                            <FontAwesome.FaExternalLink style={{ fontSize: 25 }} />
                        </NavLink>
                    </Col>
                    <Col xs="4" className={classnames({ active: this.state.activeTab === '3' })}>
                        <NavLink onClick={() => { this.toggle('3'); }}>
                            <FontAwesome.FaLightbulbO style={{ fontSize: 25}} />
                        </NavLink>
                    </Col>
                </Row>
                <br/>
                <TabContent activeTab={this.state.activeTab} >
                    <TabPane tabId="1" style={{ backgroundColor: '#fff', color: '#000' }}>
                        {this.createTrekList()}
                    </TabPane>
                    <TabPane tabId="2" style={{ backgroundColor: '#fff', color: '#000' }}>
                        {this.createResourceList()}
                    </TabPane>
                    <TabPane tabId="3" style={{ backgroundColor: '#fff', color: '#000' }}>
                        {this.createTipsList()}
                    </TabPane>
                </TabContent>
            </div>);
    }

    renderProfilePicture() {
        var result = '';

        if (this.state.userPhoto != null && this.state.userPhoto != '') {
            result = (<div style={{width: '100%'}}>                        
                        <div className="profileImg" style={{ backgroundImage: 'url(' + this.state.userPhoto + ')' }}>
                            {this.getPhotoEditElements()}
                        </div>
                    </div>)
        }
        else {
            result = (<div>                            
                        {this.getPhotoEditElements()}
                        <img alt="default avatar" style={styles.ThumbnailStyle} src="https://firebasestorage.googleapis.com/v0/b/trekker-2018.appspot.com/o/images%2FDefaultImages%2Fdc82d4d9-7877-4b63-a7ff-56a8de1f7846.png?alt=media&token=7ad8239b-c7d7-4631-a78b-4c31337dc181"/>                        
                      </div>);
        }

        return result;
    }

    getPhotoEditElements() {
        return (
                  <label className="editImg">                
                    <FontAwesome.FaPlus size={25} />
                    <FileUploader
                        hidden
                        accept="image/*"
                        name="avatar"
                        randomizeFilename
                        storageRef={firebase.storage().ref('images')}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}                        
                    />
                </label> 
            );
    }

    handleUploadStart = () => this.setState({ loading: true, progress: 0 });
    handleProgress = (progress) => { this.setState({ progress }) };
    handleUploadError = (error) => {
        this.setState({ loading: false });
        console.error(error);
    }
    handleUploadSuccess = (filename) => {
        this.setState({ progress: 100, loading: false });
        firebase.storage().ref('images').child(filename).getDownloadURL()
            .then(url => {
                db.updateUserPhoto(firebase.auth().currentUser.displayName, url);
                this.setState({ userPhoto: url })
            })
    };

    render() {
        if (this.state.user === undefined) return null

        if (this.state.loading)
            return (<div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Spinner />
                    </div>);

        return (<div>
                    <Row style={{ paddingTop: 30 }} id="ProfileHeader"> 
                        <Col xs="3">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FontAwesome.FaPlane style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}>{this.state.treks.length}</p>                       
                            </div>
                        </Col>
                        <Col xs="3">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FontAwesome.FaExternalLink style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}> {this.state.resources.length} </p>
                            </div>
                        </Col>
                        <Col xs="3">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FontAwesome.FaLightbulbO style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}>{this.state.tips.length}</p>
                            </div>
                        </Col>
                        <Col xs="3">  
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <FontAwesome.FaGroup style={styles.headerIconStyle} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={styles.headerTextStyle}>0</p>                
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: -25, marginBottom: 25  }}>                     
                                {this.renderProfilePicture()}                                
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
        zIndex: 20,
        display: 'block',
        //border: '.5px solid lightgrey'
    }
}

export default withRouter(MainProfile);