import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa'
import { Row, Col, Button } from 'reactstrap'
import * as constants from '../../constants'
import * as helpers from '../../helpers'

import * as firebase from 'firebase'

class Interactions extends Component {
    
    constructor(props) {
        super(props)

        this.state = ({
            userLikesPost: null,
            totalLikes: 0
        })
    }

    componentWillMount() {
        var likeRef = firebase.database().ref().child(constants.databaseSchema.LIKES.root)
        var self = this
        var user = firebase.auth().currentUser.displayName

        likeRef.once('value', function (snapshot) {
            //Check if this post has any likes
            if (snapshot.hasChild(self.props.id)) {
                likeRef.child(self.props.id).once('value', function (snapshot) {

                    if (snapshot.hasChild('total')) {
                        var currTotal = snapshot.child('total').val()
                        self.setState({ totalLikes: currTotal })

                        //Check if user already likes or dislikes post
                        if (snapshot.hasChild(user)) {
                            //Set state based on if user likes or dislikes post
                            self.setState({ userLikesPost: snapshot.child(user).val() === true })
                        }
                    }
                })
            }
        })
    }

    likePost(upvote) {
        var user = firebase.auth().currentUser.displayName
        var self = this
        var likeRef = firebase.database().ref().child(constants.databaseSchema.LIKES.root)

        likeRef.once('value', function (snapshot) {

            //Check if this post has any likes
            if (snapshot.hasChild(self.props.id)) {
                likeRef.child(self.props.id).once('value', function (snapshot2) {

                    var currTotal = snapshot2.child('total').val()

                    //Check if user already likes or dislikes post
                    if (snapshot2.hasChild(user)) {

                        //Check if it is a like or dislike
                        if (snapshot2.child(user).val() === true) {
                            if (upvote) {
                                //They currently like it (1) so we need to remove the record
                                likeRef.child(self.props.id).child(user).remove();
                                likeRef.child(self.props.id).update({ "total": currTotal - 1 });
                                self.updatePostData(currTotal - 1)
                                self.setState({ userLikesPost: null, totalLikes: self.state.totalLikes - 1 })
                            }
                            else {
                                //They currently like it (1) so we need to decrement total by 2
                                likeRef.child(self.props.id).update({ "total": currTotal - 2, [user]: false });
                                self.updatePostData(currTotal - 2)
                                self.setState({ userLikesPost: false, totalLikes: self.state.totalLikes - 2 })
                            }
                        }
                        else {
                            if (upvote) {
                                //They currently dislike it (-1) so we need to update to like it (1)
                                likeRef.child(self.props.id).update({
                                    "total": currTotal + 2,
                                    [user]: true
                                });
                                self.updatePostData(currTotal + 2)
                                self.setState({ userLikesPost: true, totalLikes: self.state.totalLikes + 2 })
                            }
                            else {
                                //They currently dislike it (-1) so we need to update to remove it
                                likeRef.child(self.props.id).child(user).remove();
                                likeRef.child(self.props.id).update({ "total": currTotal + 1 });
                                self.updatePostData(currTotal + 1)
                                self.setState({ userLikesPost: null, totalLikes: self.state.totalLikes + 1 })
                            }
                        }
                    }
                    else {
                        var like;

                        //No record of this user liking or disliking the post
                        if (upvote) {
                            like = {
                                "total": currTotal + 1,
                                [user]: true
                            };
                            likeRef.child(self.props.id).update(like);
                            self.updatePostData(currTotal + 1)
                            self.setState({ userLikesPost: true, totalLikes: self.state.totalLikes + 1 })
                        }
                        else {
                            like = {
                                "total": currTotal - 1,
                                [user]: false
                            };
                            likeRef.child(self.props.id).update(like);
                            self.updatePostData(currTotal - 1)
                            self.setState({ userLikesPost: false, totalLikes: self.state.totalLikes - 1 })
                        }
                    }
                })
            }
            else {
                //No likes or dislikes on this post yet
                if (upvote) {
                    likeRef.child(self.props.id).set({
                        "total": 1,
                        [user]: true
                    })
                    self.updatePostData(1)
                }
                else {
                    likeRef.child(self.props.id).set({
                        "total": -1,
                        [user]: false
                    })
                    self.updatePostData(-1)
                }
                self.setState({ userLikesPost: upvote, totalLikes: upvote ? 1 : -1 })
            }
        })
        .catch((e) => {
            console.log(e)
        })
    }
    
    updatePostData(likeCount) {
        var self = this

        //Update treks and user posts
        firebase.database().ref().child('/'+constants.databaseSchema.TREKS.root +'/' + self.props.id).once('value', function (snapshot) {
            //Update the post
            if (snapshot.hasChild('likes')) {
                snapshot.ref.update({ 'likes': likeCount })
            }
            else {
                var likeRec = {};
                likeRec['likes'] = 1;
                snapshot.ref.update(likeRec)
            }
        })
        .then(() => {
            //Update user posts
            firebase.database().ref().child(constants.databaseSchema.USER_TREKS.root).child(self.props.user).child(self.props.id).once('value', function (snapshot) {
                //Update the post
                if (snapshot.hasChild('likes')) {
                    snapshot.ref.update({ 'likes': likeCount })
                }
                else {
                    var likeRec = {};
                    likeRec['likes'] = 1;
                    snapshot.ref.update(likeRec)
                }
            })
        });
    }

    renderInteractions() {
        var likes = helpers.formatNumber(this.state.totalLikes);
        return (
            <Row>
                <Col xs="4" style={{ alignItems: 'center' }}>
                    <Button color="link" style={styles.InteractionButtonStyle} onClick={() => { this.likePost(false) }}>
                        {this.state.userLikesPost === false ? <FontAwesome.FaThumbsDown size={30} style={{color: '#ff5858' }} /> : <FontAwesome.FaThumbsODown style={{ color: '#fff' }} />}
                    </Button>
                </Col>                       
                <Col xs="4">
                    <Button color="link" style={styles.InteractionButtonStyle}><h3>{likes}</h3></Button>
                </Col>
                <Col xs="4">
                    <Button color="link" style={styles.InteractionButtonStyle} onClick={() => { this.likePost(true) }}>
                        {this.state.userLikesPost === true ? <FontAwesome.FaThumbsUp size={30} style={{ color: '#58ff58' }} /> : <FontAwesome.FaThumbsOUp style={{ color: '#fff' }}/>}
                    </Button>
                </Col>                   
            </Row>
    )}

    render() {
        return this.renderInteractions();
    }
}

const styles = {
    InteractionButtonStyle: {
        color: '#fff',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center'
    }
}

export default Interactions;