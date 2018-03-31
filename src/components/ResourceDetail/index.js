import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa'
import { Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase'
import PostActionsButton from '../Misc/PostActionsButton'
import * as constants from '../../constants'

class ResourceDetail extends Component {

    constructor(props) {
        super(props)
        this.deleteResource=this.deleteResource.bind(this);
    }

    componentWillMount() {
        this.setState({ record: this.props.id, resource: this.props.resource });
    }
    
    deleteResource(key) {

        //remove from posts
        var trekRef = firebase.database().ref().child('resources');
        trekRef.once('value', function (snapshot) {
            if (snapshot.hasChild(key)) {
                trekRef.child(key).remove();
            }
        });

        //remove from user tips
        var userPostRef = firebase.database().ref().child(constants.databaseSchema.USER_RESOURCES.root).child(firebase.auth().currentUser.displayName);
        userPostRef.once('value', function (snapshot) {
            if (snapshot.hasChild(key)) {
                userPostRef.child(key).remove();
            }
        });

        this.props.handleDeletedResource(key);
    }

    renderEditable() {
        if (this.props.resource.user === firebase.auth().currentUser.displayName) {
            return <PostActionsButton handleDelete={() => { if (window.confirm('Do you want to delete this resource??')) { this.deleteTip(this.props.id) } }}/>               
        }
    }

    render() {
        var item = this.props.resource;
        
        var hasSummary = (item.resourceSummary !== undefined && item.resourceSummary.trim() !== "")

        return (<Col xs="12" sm={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }} style={{ width: '100%', marginBottom: 50, backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15,}} key={item.link + item.datePosted}>
                    <a href={item.link} target="_blank">
                <Row style={{ backgroundColor: '#ff8142', color: '#fff', paddingTop: 5, borderBottomLeftRadius: hasSummary ? null : 15, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomRightRadius: hasSummary ? null : 15 }} >
                            <Col xs="10">
                                <h5><b>{item.resourceTitle}</b></h5>
                            </Col>
                            <Col xs="2">
                                <h5><FontAwesome.FaExternalLink /></h5>
                            </Col>
                        </Row>
                    </a>
                    <br/>
                    <Row style={{color: '#000'}}>
                        <Col xs="12">
                            <center>  <p>{hasSummary ? item.resourceSummary : null} </p> </center>
                        </Col>                        
                    </Row>
                    <Row style={{ color: '#000' }}>
                        <Col xs="6">
                            {this.renderEditable()}
                        </Col>
                        <Col xs="6" style={{ textAlign: 'right' }}>
                            <p><small>{item.user} </small></p>
                        </Col>
                    </Row>                    
                    {hasSummary ? <hr /> : null}                    
                </Col>            
        );
    }
}

export default withRouter(ResourceDetail);