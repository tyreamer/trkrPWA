import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { Container, Col, Row, Button, Form, FormGroup, Input } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import * as constants from '../../../constants';
import TagList from '../../TagList'
import * as firebase from 'firebase'

class CreateTipPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tipTitle: '',
            tipText: '',
            tipTags: [],
            currentTag: ''
        }
    }

    insertPost() {

        //TODO better validation
        if (this.state.tipTitle === '' || this.state.tipText === '') {
            alert('Make sure to provide a title and some text before saving')
            return;
        }
        
        var user = firebase.auth().currentUser.displayName
        var self = this

        firebase.database().ref('/' + constants.databaseSchema.USERS.root + '/' + user).once('value')
            .then(function (snapshot) {
                var tipData = {
                    tipTitle: self.state.tipTitle,
                    tipText: self.state.tipText,
                    tipTags: self.state.tipTags,
                    user: user,
                    datePosted: Date.now()
                };

                // Get a key for a new Post.
                var newTipKey = firebase.database().ref().child(constants.databaseSchema.TIPS.root).push().key;

                // Write the new post's data simultaneously in the resources list and the user's resource list.
                var updates = {};
                updates['/' + constants.databaseSchema.TIPS.root +'/' + newTipKey] = tipData;
                updates['/' + constants.databaseSchema.TIPS.root +'/' + user + '/' + newTipKey] = tipData;

                var tagRef = firebase.database().ref().child(constants.databaseSchema.TAGS.root)

                tagRef.once('value', function (snapshot) {
                    for (var i = 0; i < self.state.tipTags.length; i++) {
                        var tag = self.state.tipTags[i].toLowerCase().trim().replace(/\s+/, "")
                        if (snapshot.hasChild(tag)) {
                            var updatedTag = {};
                            updatedTag[newTipKey] = constants.databaseSchema.TIPS.root;
                            tagRef.update(updatedTag);
                        }
                        else {
                            var newTag = tagRef.child(tag)
                            newTag.set({
                                [newTipKey]: constants.databaseSchema.TIPS.root
                            })
                        }
                    }
                });


                firebase.database().ref().update(updates)
                    .then(() => {
                        console.log('saved tip')
                        self.props.history.push(constants.routes.HOME)
                    })
                    .catch(() => {
                        alert('Something went wrong, please try again.')
                    });
            })
    }

    renderTagList() {
        if (this.state.tipTags.length > 0) {
            return <TagList tags={this.state.tipTags} />
        }
        else {
            return
        }
    }

    removeTag(t) {
        /*TODO FIX THIS (currently only able to remove last tag added)*/
        var index = this.state.tipTags.indexOf(t.tag);
        var newTags = this.state.tipTags;
        if (index > -1) {
            newTags.splice(index, 1);
            this.setState({ tipTags: newTags })
        }
    }

    render() {

        return (
            <Container>
                <Row style={{ position: 'sticky', top: 0, backgroundColor: '#6db5ff' }}>
                    <Col xs="12">
                        <h3>
                            <FontAwesome.FaChevronLeft style={{ color: 'rgba(255,255,255, .6)' }} onClick={() => {
                                if (window.confirm('Are you sure you want to go back and cancel your post?')) {
                                    this.props.history.goBack()
                                }
                            }} />
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <Form style={[styles.HeaderInputStyle, { height: '100%', borderLeftWidth: 0, borderTopWidth: 0, borderBottomWidth: 0, borderRightWidth: 0 }]}>                     
                            <FormGroup xs="12" style={styles.IconTextSameLine}>
                                <FontAwesome.FaInfoCircle style={{ color: '#fff' }} />
                                <Input
                                    type="text"
                                    placeholder='title'
                                    value={this.state.tipTitle}
                                    onChange={tipTitle => this.setState({ tipTitle: tipTitle.target.value })}
                                    style={[styles.HeaderInputStyle, { color: '#fff', textDecorationLine: 'none' }]}
                                />
                            </FormGroup>
                            <FormGroup style={styles.IconTextSameLine}>                                   
                                <Input
                                    type="text"
                                    placeholder='add tags'
                                    value={this.state.currentTag}
                                    onChange={(currentTag) => { this.setState({ currentTag: currentTag.target.value.replace(' ', '') }) }}
                                    style={[styles.HeaderInputStyle, { color: '#fff', textDecorationLine: 'none' }]}
                                />                                 
                                {                                   
                                    this.state.currentTag !== ''
                                    ? <FontAwesome.FaPlus
                                            onClick={() => {
                                                if (this.state.tipTags.indexOf(this.state.currentTag) === -1) {
                                                    var ct = this.state.tipTags;
                                                    ct.push(this.state.currentTag)
                                                    this.setState({ trekTags: ct })
                                                }
                                                this.setState({ currentTag: '' })
                                            }}
                                            style={{ fontWeight: 'bold', color: 'grey'}}/>
                                    : null
                                }        
                            </FormGroup>
                            <FormGroup>
                                {this.state.tipTags !== [] ? this.renderTagList() : null}
                            </FormGroup>
                            <FormGroup>                                    
                                <Input
                                    type="textarea"
                                    placeholder='tip'
                                    value={this.state.tipText}
                                    onChange={tipText => this.setState({ tipText: tipText.target.value })}
                                    style={{ float: 'left' }}
                                />  
                            </FormGroup> 
                        </Form>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs="12" style={{padding: 0}}>
                        <FormGroup>
                            <Button
                                color="primary"
                                style={{ width: '100%', textAlign: 'right' }}
                                title="Submit"
                                onClick={() => { this.insertPost() }}>
                                <h4>
                                    submit post &nbsp;&nbsp;
                                    <FontAwesome.FaChevronRight style={{ marginBottom: 4 }} />
                                </h4>
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
                <hr />
            </Container>
        );
    }
}

const styles = {
    MainContainer:
    {
        flex: 1,
        backgroundColor: "#6db5ff",
        height: '100%'
    },
    HeaderStyle:
    {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    HeaderCardItemStyle:
    {
        width: '100%',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: .5,
        borderBottomColor: '#fff'
    },
    HeaderButtonStyle:
    {
        marginTop: 5,
        marginRight: 5
    },
    IconTextSameLine:
    {
        paddingLeft: 8,
        width: 100,
        flex: 1,
        display: 'inline'
    },
}

export default withRouter(CreateTipPage);