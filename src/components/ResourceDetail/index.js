import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa'
import { Row, Col, Container } from 'reactstrap'
import { withRouter, Link } from 'react-router-dom';
import * as firebase from 'firebase'
import PostActionsButton from '../Misc/PostActionsButton'
import * as constants from '../../constants'
import './index.css'
import { ToastContainer, toast } from 'react-toastify';

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
        var trekRef = firebase.database().ref().child(constants.databaseSchema.RESOURCES.root);
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

        toast.success('Successfully deleted', { position: toast.POSITION.BOTTOM_CENTER });
        this.props.handleDeletedResource(key);
    }

    renderEditable() {
        if (this.props.resource.user === firebase.auth().currentUser.displayName) {
            return <PostActionsButton handleDelete={() => { if (window.confirm('Do you want to delete this resource??')) { this.deleteResource(this.props.id) } }}/>               
        }
    }

    render() {
        var item = this.props.resource;
        var hasSummary = (item.resourceSummary !== undefined && item.resourceSummary.trim() !== "")

        return (<Row style={{ marginBottom: 50 }}>
                    <Col xs="12" sm={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }} key={item.link + item.datePosted}>
                        <Container className="resource-highlight" style={{ backgroundColor: 'rgba(255,255,255,.2)', color: '#fff', width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                            <a href={item.link} target="_blank">
                                <Row className="resource-header" style={{ color: '#fff', paddingTop: 5, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} >
                                    <Col xs="10">
                                        <h5><b>{item.resourceTitle}</b></h5>
                                    </Col>
                                    <Col xs="2">
                                        <h5><FontAwesome.FaExternalLink /></h5>
                                    </Col>
                                </Row>
                            </a>
                            <br />
                            {
                                hasSummary ?
                                <Row>
                                    <Col xs="12">
                                        <p>{item.resourceSummary} </p>
                                    </Col>
                                </Row>
                                : null
                            }
                            <Row>
                                <Col xs="6" style={{paddingLeft: 0}}>
                                    {this.renderEditable()}
                                </Col>
                                <Col xs="6" style={{ textAlign: 'right' }}>
                                    <Link style={{ color: '#fff' }} to={{ pathname: constants.routes.PROFILE, state: { user: item.user } }}>
                                        <p><small>{item.user} </small></p>
                                    </Link>
                                </Col>
                            </Row>                    
                        </Container>
                    </Col>   
                    <ToastContainer autoClose={2000} />
                </Row>
        );
    }
}

export default withRouter(ResourceDetail);