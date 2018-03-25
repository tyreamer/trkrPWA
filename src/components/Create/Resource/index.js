import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import JSONP from 'jsonp';
import Autocomplete from 'react-autocomplete'
import { Container, Col, Row, Button, Form, FormGroup, Input, InputGroup } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import * as routes from '../../../constants/routes';
import * as firebase from 'firebase'
import './index.css'

class CreateResourcePage extends Component {


    constructor(props) {
        super(props)
        this.state = {
            resourceTitle: '',
            resourceLink: '',
            resourceSummary: '',
            possibleLinks: [''],
            resourceLinkTextValue: ''
        }
    }

    insertResource() {
        var user = firebase.auth().currentUser.displayName
        var self = this
        if (this.state.resourceTitle === '' || this.state.resourceLink === '') {
            alert('Make sure to provide a title and link before saving')
            return;
        }
        firebase.database().ref('/users/' + user).once('value')
            .then(function (snapshot) {
                var resourceData = {
                    resourceTitle: self.state.resourceTitle,
                    link: self.state.resourceLink,
                    resourceSummary: self.state.resourceSummary,
                    user: user,
                    datePosted: Date.now()
                };

                // Get a key for a new Post.
                var newResourceKey = firebase.database().ref().child('resources').push().key;

                // Write the new post's data simultaneously in the resources list and the user's resource list.
                var updates = {};
                updates['/resources/' + newResourceKey] = resourceData;
                updates['/user-resources/' + user + '/' + newResourceKey] = resourceData;

                firebase.database().ref().update(updates)
                    .then(() => {
                        self.props.history.push(routes.HOME)
                    })
                    .catch((e) => {
                        console.log(e)
                        alert('Something went wrong, please try again.')
                    });
            })
    }

    render() {
        console.log(this.state.textValue)
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
                        <Form>
                            <hr />  
                            <InputGroup style={{ height: 30 }} className="autocompleteBox">
                                <Autocomplete
                                    placeholder="resource url"
                                    inputProps={{ placeholder: 'resource URL', className: 'form-control' }}
                                    renderInput={(props) => <input {...props} /> }
                                    wrapperStyle={{ zIndex: 400, width: '100%' }}
                                    getItemValue={(item) => item}
                                    items={this.state.possibleLinks}
                                    renderItem={(item, isHighlighted) =>
                                        <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item}>
                                            {item}
                                        </div>
                                    }
                                    value={this.state.resourceLinkTextValue}
                                    onChange={(event, text) => {
                                        this.setState({
                                            resourceLinkTextValue: text
                                        })
                                        var self = this
                                        if (text && text.trim() !== '') {
                                            var fetchURL = googleURL + `${'http://' + text}`;
                                            JSONP(fetchURL, function (error, data) {
                                                self.setState({ possibleLinks: data[1] })
                                            });
                                        } else {
                                            self.setState({ possibleLinks: [] })
                                        }
                                    }}
                                    onSelect={(val) => { this.setState({ resourceLink: val, resourceLinkTextValue: val }) }}
                                />
                            </InputGroup>
                            <br/>
                            <InputGroup style={{ height: 30 }}>                                
                                <Input
                                    placeholder="title"
                                    type="text"
                                    value={this.state.resourceTitle}
                                    onChange={resourceTitle => this.setState({ resourceTitle: resourceTitle.target.value })}                                    
                                />
                            </InputGroup>
                            <br/>  
                            <InputGroup>                                
                                <Input
                                    placeholder="description"
                                    type="textarea"
                                    value={this.state.resourceSummary}
                                    onChange={resourceSummary => this.setState({ resourceSummary: resourceSummary.target.value })}
                                />
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col xs="12" style={{ padding: 0 }}>
                        <FormGroup>
                            <Button
                                color="primary"
                                style={{ float: 'right', width: '100%', textAlign: 'right', zIndex: 10 }}
                                title="Submit"
                                onClick={() => { this.insertResource() }}>
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

const googleURL = `http://suggestqueries.google.com/complete/search?client=chrome&q=`;

export default withRouter(CreateResourcePage);