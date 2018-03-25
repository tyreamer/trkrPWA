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
import * as routes from '../../../constants/routes';
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
                    this.props.history.push(routes.LANDING)
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
                list.push(<ResourceDetail key={resource.datePosted + resource.user} resource={resource} />)
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
                list.push(<TipDetail key={this.state.tips[i].datePosted + this.state.tips[i].tipTitle} tip={this.state.tips[i]} />)
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
                <Row style={{ textAlign: 'center', fontWeight: 'bold', color: 'grey', boxShadow: '0 10px 2px -2px #f8f8f8', backgroundColor: '#f8f8f8', height: 50 }}>
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

        if (this.state.userPhoto !== undefined && this.state.userPhoto !== '') {            
            result = (<div style={{width: '100%'}}>                        
                        <div className="profileImg" style={{ backgroundImage: 'url(' + this.state.userPhoto + ')' }}>
                            {this.getPhotoEditElements()}
                        </div>
                    </div>)
        }
        else {
            result = (<div style={{width: '100%' }}>                                      
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
                    <Row style={{ backgroundColor: '#fff', paddingTop: 20, paddingBottom: 20, boxShadow: '0 5px 2px -2px #f8f8f8' }}>
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
                                        <div onClick={() => { this.props.history.push(routes.ACCOUNT) }} style={{ float: 'right', display: 'inline', paddingRight: 15 }}>
                                            <FontAwesome.FaCog size={30} />
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
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