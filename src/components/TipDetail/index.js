import React, { Component } from 'react';
import * as routes from '../../constants/routes';
import * as FontAwesome from 'react-icons/lib/fa'
import { Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import TagList from '../TagList'
import * as firebase from 'firebase'

class TipDetail extends Component {

    constructor(props) {
        super(props)
        this.deleteTip=this.deleteTip.bind(this);
    }

    componentWillMount() {
        this.setState({ record: this.props.id, tip: this.props.tip });
    }
    
    deleteTip(key) {
        var self = this;

        //remove from posts
        var trekRef = firebase.database().ref().child('tips');
        trekRef.once('value', function (snapshot) {
            if (snapshot.hasChild(key)) {
                trekRef.child(key).remove();
            }
        });

        //remove from user tips
        var userPostRef = firebase.database().ref().child('user-tips').child(firebase.auth().currentUser.displayName);
        userPostRef.once('value', function (snapshot) {
            if (snapshot.hasChild(key)) {
                userPostRef.child(key).remove();
            }
        });

        //remove post from tags
        var tagRef = firebase.database().ref().child('tags')
        tagRef.once('value', function (snapshot) {
            if (self.props.tip.tipTags !== null && self.props.tip.tipTags !== undefined) {
                for (var i = 0; i < self.props.tip.tipTags.length; i++) {
                    var tag = self.props.tip.tipTags[i].toLowerCase().trim()
                    if (snapshot.hasChild(tag)) {
                        tagRef.child(tag).child(key).remove();
                    }
                }
            }
        });

        this.props.handleDeletedTip(key);
    }

    renderEditable() {
        if (this.props.tip.user === firebase.auth().currentUser.displayName) {
            return <FontAwesome.FaMinusCircle size={20} name="ios-remove-circle-outline" style={{ color: 'lightgrey' }} onClick={() => { if (window.confirm('Do you want to delete this tip??')) { this.deleteTip(this.props.id) } }}/>               
        }
    }

    render() {
        var date = new Date(this.props.tip.datePosted);
        date = (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
        return (<Col xs="12" sm={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}  style={{ borderLeft: '1px solid #f8f8f8', borderRight: '1px solid #f8f8f8', borderBottom: '1px solid #f8f8f8', marginBottom: '50px' }}>
                    <Row>
                        <Col xs="12">
                            <h4 style={{ fontWeight: 'bold' }}>{this.props.tip.tipTitle}</h4>
                        </Col>
                    </Row>                    
                    <Row>
                        <Col xs="12">
                            <p>{this.props.tip.tipText}</p>
                            <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 5 }}>
                                    <TagList tags={this.props.tip.tipTags} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="2">
                            {this.renderEditable()}
                        </Col>
                        <Col xs="10">
                            <p style={{ textAlign: 'right', lineHeight: .9  }}
                                onClick={() => { this.props.history.push(routes.PROFILE) }}>
                                <b> {this.props.tip.displayName ? this.props.tip.displayName : ""} </b>                            
                                <br/>
                                <small>{date}</small>
                            </p>
                        </Col>
                    </Row>
        </Col>);
    }
}

export default withRouter(TipDetail);