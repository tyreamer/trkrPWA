import React, { Component } from 'react';

import * as firebase from 'firebase';
import { db } from '../../../firebase';
import classnames from 'classnames';
import { withRouter  } from 'react-router-dom';
import * as FontAwesome from 'react-icons/lib/fa'
import FileUploader from 'react-firebase-file-uploader';
import { Container, Row, Col, TabPane, NavLink, TabContent } from 'reactstrap'
import './index.css'
import Spinner from '../../Misc/Spinner'
import TipDetail from '../../TipDetail'
import TrekDetail from '../../TrekDetail'
import ResourceDetail from '../../ResourceDetail'
import * as constants from '../../../constants';
import { ToastContainer, toast } from 'react-toastify';

class MainProfile extends Component {

    constructor(props) {
        super(props);

        this.removeTrek = this.removeTrek.bind(this)
        this.toggle = this.toggle.bind(this);
        this.signOut = this.signOut.bind(this)
    }

    state = {
        treks: [],
        resources: [],
        tips: [],
        currentView: '',
        loading: true,
        user: null,
        activeTab: '1'
    }
    
    componentWillMount() {        
        this.getUser() 
    }

    componentDidMount() {
        var self = this

        var myTreks = []
        if (this.state.user !== undefined && this.state.user !== null) {
            //retrieve posts
            firebase.database().ref(constants.databaseSchema.USER_TREKS.root).child(this.state.user).once('value')
                .then(function (snapshot) {
                    snapshot.forEach(function (child) {
                        myTreks.unshift({ id: child.key, details: child.val() })
                    })
                })
                .then(() => self.setState({ treks: myTreks, loading: false }))
                .catch((e) => console.log('Fetch Error (treks): ' + e))

            //retrieve photo
            firebase.database().ref(constants.databaseSchema.USERS.root).child(this.state.user).once('value')
                .then(function (snapshot) {
                    if (snapshot.hasChild('photo')) {
                        self.setState({ userPhoto: snapshot.child('photo').val() })
                    }
                })
                .catch((e) => console.log('Fetch Error (' + constants.databaseSchema.USERS.root +'): ' + e))
        }   

        var myResources = [];
        firebase.database().ref('/' + constants.databaseSchema.USER_RESOURCES.root ).child(this.state.user).once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (child) {
                    myResources.unshift({ id: child.key, details: child.val() })
                })
            })
            .then(() => self.setState({ resources: myResources }))
            .catch((e) => console.log('Fetch Error (' + constants.databaseSchema.USER_RESOURCES.root +'): ' + e))

        var myTips = [];
        firebase.database().ref('/' + constants.databaseSchema.USER_TIPS.root ).child(this.state.user).once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (child) {
                    myTips.unshift({ id: child.key, details: child.val() })
                })
            })
            .then(() => self.setState({ tips: myTips }))
            .catch((e) => console.log('Fetch Error (' + constants.databaseSchema.USER_TIPS.root +'): ' + e))
    }

    getUser() {
        if (this.props !== undefined) {
            if (this.props.location !== undefined) {
                if (this.props.location.state !== undefined) {
                    if (this.props.location.state.user !== undefined) {
                        this.setState({ user: this.props.location.state.user })
                        return;
                    }
                }
            }
        }

        this.setState({ user: firebase.auth().currentUser.displayName })   
    }

    signOut() {
        if (window.confirm('Are you sure you want to sign out?')) {
            firebase.auth().signOut()
                .then(() => {
                    this.props.history.push(constants.routes.LANDING)
                })
                .catch((e) => { console.log('Sign-Out Exception: ' + e) })
        }
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

    removeTip(key) {
        var idx;

        for (var i = 0; i < this.state.tips.length; i++) {
            if (this.state.feedList[i].id === key) {
                idx = i;
                break;
            }
        }

        var newFeedList = this.state.feedList;
        newFeedList.splice(idx, 1);
        this.setState({ feedList: newFeedList })
    }

    removeResource(key) {
        var idx;

        for (var i = 0; i < this.state.resources.length; i++) {
            if (this.state.feedList[i].id === key) {
                idx = i;
                break;
            }
        }

        var newFeedList = this.state.feedList;
        newFeedList.splice(idx, 1);
        this.setState({ feedList: newFeedList })
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
                  list.push(<div style={{ display: 'flex', justifyContent: 'center'}} key={trek.id}>
                                <TrekDetail key={trek.id} id={trek.id} trekRecord={trek.details} handleDeletedTrek={self.removeItem} />
                            </div>)
            })

            if (list.length === 0) {
                return (
                <Container style={{ padding: 75, alignItems: 'center', justifyContent: 'center' }}>
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
                list.push(<ResourceDetail key={resource.id} id={resource.id} resource={resource.details} handleDeletedResource={this.removeResource} />)
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
                list.push(<TipDetail key={this.state.tips[i].id} id={this.state.tips[i].id} tip={this.state.tips[i].details} handleDeletedTip={this.removeTip} />)
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
            <Container>
                <Row style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 2px -2px #f8f8f8', height: 50 }}>
                    <Col xs="4" className={classnames({ active: this.state.activeTab === '1' })}>
                        <NavLink onClick={() => { this.toggle('1'); }}>
                            <h3><FontAwesome.FaPlane style={{fontSize: 25 }}/></h3>
                        </NavLink>
                    </Col>
                    <Col xs="4" className={classnames({ active: this.state.activeTab === '2' })}>
                        <NavLink onClick={() => { this.toggle('2'); }}>
                            <h3><FontAwesome.FaExternalLink style={{ fontSize: 25 }} /></h3>
                        </NavLink>
                    </Col>
                    <Col xs="4" className={classnames({ active: this.state.activeTab === '3' })}>
                        <NavLink onClick={() => { this.toggle('3'); }}>
                            <h3><FontAwesome.FaLightbulbO style={{ fontSize: 25 }} /></h3>
                        </NavLink>
                    </Col>
                </Row>
                <br/>
                <TabContent activeTab={this.state.activeTab} >
                    <TabPane tabId="1">
                        {this.createTrekList()}
                    </TabPane>
                    <TabPane tabId="2">
                        {this.createResourceList()}
                    </TabPane>
                    <TabPane tabId="3">
                        {this.createTipsList()}
                    </TabPane>
                </TabContent>
            </Container>);
    }

    renderProfilePicture() {
        var result = '';

        if (this.state.userPhoto !== undefined && this.state.userPhoto !== '') {            
            result = (<div style={{width: '100%', padding: 20}}>                        
                        <div className="profileImg" style={{ backgroundImage: 'url(' + this.state.userPhoto + ')' }}>
                            {this.getPhotoEditElements()}
                        </div>
                    </div>)
        }
        else {
            result = (<div style={{width: '100%', padding: 20 }}>                                      
                        <div className="profileImg" style={{backgroundImage: 'url("https://png.pngtree.com/element_origin_min_pic/17/08/08/56a1a62660704f2041da8de7bdc7aefc.jpg")' }}>
                            {this.getPhotoEditElements()}
                        </div>
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

                //add this to the users profile
                db.updateUserPhoto(firebase.auth().currentUser.displayName, url);

                //remove the old photo
                try {
                    var currentPhoto = this.state.userPhoto.match(new RegExp('/images%2F(.*)?alt=media'))[1].replace('?', '');
                    firebase.storage().ref('images').child(currentPhoto).delete().catch((e) => { })
                }
                catch (err) {
                    //we must not have a photo
                }
               
                //update our state
                this.setState({ userPhoto: url })
                toast.success('photo updated!', { position: toast.POSITION.BOTTOM_CENTER });
            })
    };

    render() {
        
        if (this.state.user === undefined) return null

        if (this.state.loading)
            return (<div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Spinner />
                    </div>);
        
        return (<div>
                    <Row style={{color: '#fff', paddingTop: 20, paddingBottom: 20, boxShadow: '0 1px 2px -2px #f8f8f8' }}>
                        <Col xs="8">
                            <h5 style={{ marginLeft: 5 }}><b> {this.state.user}</b></h5>
                        </Col>
                        <Col xs="4" style={{ paddingRight: 0 }}>
                            {
                                firebase.auth().currentUser.displayName === this.state.user
                                    ?
                                    <div>
                                        <div onClick={() => { this.signOut() }} style={{ float: 'right', display: 'inline' }}>
                                            <FontAwesome.FaSignOut size={30} />
                                        </div>
                                        <div onClick={() => { this.props.history.push(constants.routes.ACCOUNT) }} style={{ float: 'right', display: 'inline', paddingRight: 15 }}>
                                            <FontAwesome.FaCog size={30} />
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: 30, marginBottom: -10 }} id="ProfileHeader"> 
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
                            {this.renderProfilePicture()}    
                        </Col>
                    </Row>
                    <Row>
                        {this.generateContent()}
                    </Row>
                    <ToastContainer autoClose={2000}/>
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
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    headerIconStyle:
    {
        color: '#fff',
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