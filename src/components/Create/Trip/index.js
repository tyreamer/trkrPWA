import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { Container, Col, Row, Button, FormGroup, Input, InputGroupAddon, InputGroup} from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import * as routes from '../../../constants/routes';
import TagList from '../../TagList'
import * as firebase from 'firebase'
import TrekDay from './TrekDay'

class CreateTripPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            days: [{ key: 1, stops: [] }],
            showToast: false,
            showSummary: false,
            trekName: '',
            trekTags: [],
            currentTag: '',
            budget: '0',
            summary: ''
        }

        this.removeDay = this.removeDay.bind(this);
    }

    constructItinerary() {
        var daysList = []
        this.state.days.forEach(day => {
            daysList.push(<TrekDay key={day.key} dayNumber={day.key} stops={day.stops} handleRemoveDay={this.removeDay} handleNewStop={this.addStopToDay} />)
        })
        return daysList
    }

    addDay() {
        var nextDay = this.state.days.length + 1
        var newDaysArr = this.state.days.concat({
            "key": nextDay,
            stops: []
        });
        this.setState({ days: newDaysArr })
    }

    removeDay(dayNum) {
        /*TODO FIX THIS (currently only deletes last)*/
        var newDaysArr = this.state.days;
        for (var i = newDaysArr.length - 1; i >= 0; i--) {
            if (newDaysArr[i].key === dayNum) {
                newDaysArr.splice(i, 1);
                break;
            }
        }

        //fix all proceeding days
        for (var d = dayNum - 1; d < newDaysArr.length; d++) {
            newDaysArr[d].key = newDaysArr[d].key - 1;
        }
        this.setState({ days: newDaysArr })
    }

    addStopToDay = (stopNum, stopInfo, dayNum) => {
        var newStopsArr = this.state.days[dayNum - 1].stops.concat({ key: this.state.days[dayNum - 1].stops.length, "stopName": stopInfo });

        var newDaysArr = this.state.days
        newDaysArr[dayNum - 1]["stops"] = newStopsArr

        this.setState({ days: newDaysArr })
    }

    insertTrek() {
        if (this.state.trekName === '') {
            alert('Make sure to name your trip before saving');
            return;
        }
        if (this.state.days[0].stops.length === 0) {
           alert('Add at least 1 stop to your trip before saving')
            return;
        }

        var user = firebase.auth().currentUser.displayName
        var self = this
        var tags = this.state.trekTags

        firebase.database().ref('/users/' + user).once('value')
            .then(function (snapshot) {
                var postData = {
                    title: self.state.trekName,
                    user: user,
                    displayName: user,
                    days: self.state.days,
                    datePosted: Date.now(),
                    trekTags: tags,
                    budget: self.state.budget,
                    summary: self.state.summary
                };

                // Get a key for a new Post.
                var newPostKey = firebase.database().ref().child('treks').push().key;

                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/treks/' + newPostKey] = postData;
                updates['/user-posts/' + user + '/' + newPostKey] = postData;

                var tagRef = firebase.database().ref().child('tags')
                tagRef.once('value', function (snapshot) {
                    for (var i = 0; i < tags.length; i++) {
                        var tag = tags[i].toLowerCase().trim()
                        if (snapshot.hasChild(tag)) {
                            var updatedTag = {};
                            updatedTag[newPostKey] = 'trek';
                            tagRef.child(tag).update(updatedTag);
                        }
                        else {
                            var newTag = tagRef.child(tag)
                            newTag.set({
                                [newPostKey]: 'trek'
                            })
                        }
                    }
                }
                );

                firebase.database().ref().update(updates).then(() => {
                    self.props.history.push(routes.HOME)
                });
            })
    }

    renderTagList() {
        if (this.state.trekTags !== undefined && this.state.trekTags !== null) {
            if (this.state.trekTags.length > 0) {
                return (<Col xs={{ size: 11, offset: 1 }} style={{ overflowX: 'auto', overflowY: 'hidden' }}><TagList tags={this.state.trekTags} /></Col>);
            }
        }
    }

    removeTag(t) {
        /*TODO FIX THIS (currently only able to remove last tag added)*/
        var index = this.state.trekTags.indexOf(t.tag);
        var newTags = this.state.trekTags;
        if (index > -1) {
            newTags.splice(index, 1);
            this.setState({ trekTags: newTags })
        }
    }

    render() {
 
        return (
            <div>                
                <Row style={{ backgroundColor: '#6db5ff', padding: 5 }}>
                    <Col xs="10">
                        <FontAwesome.FaChevronLeft
                            onClick={() => {
                                if (window.confirm('Are you sure you want to go back and cancel your post?')) {
                                    this.props.history.goBack()
                                }
                            }}
                            style={{ color: '#fff', marginTop: '10' }} />
                    </Col>
                    <Col xs="2">
                        <Button
                            style={{ backgroundColor: '#ff5858', float: 'right' }}
                            onClick={() => { this.insertTrek() }}>
                            <p style={{ color: '#fff', margin: '0 auto' }}>Save</p>
                        </Button>
                    </Col>
                </Row> 
                <br/>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button color="link">
                            <FontAwesome.FaInfoCircle style={{ color: 'grey' }}/>
                        </Button>
                    </InputGroupAddon>
                    <Input
                        placeholder='title'
                        type="text"
                        value={this.state.trekName}
                        onChange={trekName => this.setState({ trekName: trekName.target.value })}                       
                    />
                </InputGroup>
                <br/>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button color="link">
                            <FontAwesome.FaDollar style={{ color: 'grey' }} />
                        </Button>
                    </InputGroupAddon>
                    <Input
                        type="number"
                        placeholder='0'
                        value={this.state.budget === '0' ? '' : this.state.budget}
                        onChange={budget => this.setState({ budget: budget.target.value })}                                
                    />
                </InputGroup>
                <br />
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button color="link">
                            <FontAwesome.FaHashtag style={{ color: 'grey' }} />
                        </Button>
                    </InputGroupAddon>
                    <Input
                        placeholder='add tags'
                        type="text"
                        value={this.state.currentTag}
                        onChange={currentTag => this.setState({ currentTag: currentTag.target.value.replace(' ', '') })}
                    />
                    {this.state.currentTag !== ''
                        ?
                        (<InputGroupAddon addonType="append">
                            <Button
                                color="link"
                                onClick={() => {
                                    if (this.state.trekTags.indexOf(this.state.currentTag) == -1) {
                                        var ct = this.state.trekTags;
                                        ct.push(this.state.currentTag)
                                        this.setState({ trekTags: ct })
                                    }
                                    this.setState({ currentTag: ''})
                                }}>
                                <FontAwesome.FaPlusSquare style={{ color: 'grey' }} />
                            </Button>
                        </InputGroupAddon>)
                        :
                        null
                    }
                </InputGroup>
                {this.state.trekTags !== [] ? this.renderTagList() : null}
                <br />
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button color="link">
                            <FontAwesome.FaPencil style={{ color: 'grey' }} />
                        </Button>
                    </InputGroupAddon>
                    <Input
                        placeholder=''
                        type="textarea"
                        value={this.state.summary}
                        onChange={summary => this.setState({ summary: summary.target.value })}
                    />
                </InputGroup>
                <hr/>
                <Row>
                    {this.constructItinerary()}
                </Row>
                <hr/>
                <Row>
                    <Col xs="12">
                        <Button                
                            style={{width: '100%', backgroundColor: '#5b4fff'}}
                            onClick={() => { this.addDay() }}>
                            
                            <h6 style={{ color: 'white' }}>
                                <FontAwesome.FaPlusSquare />
                                &nbsp; Add a day
                            </h6>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(CreateTripPage);