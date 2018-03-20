import { db, auth } from './firebase';

function cleanUsername(username) {
    return username.toLowerCase().replace(/\./g, ',');
}

// User API

export const doCreateUser = (id, username, email) => {
    username = cleanUsername(username);
    db.ref(`users/${username}`).set({
        displayName: username,
        email: email,
    }).then(() => { return true } );
}

export const isUsernameAvailable = (username) => {    
    username = cleanUsername(username);
    var userRef = db.ref(`users`);
    return new Promise(function (resolve, reject) {
        userRef.once('value', function (snapshot) {
            if (snapshot.child(username).val() === null) {
                return resolve()
            }
            else {
                return reject()
            }
        });
    })
}

export const updateUserPhoto = (username, url) => {
    return new Promise(function (resolve, reject) {        
        db.ref(`users`).child(username).update({
            photo: url
        })
    })
}

export const onceGetTreks = () => 
    db.ref('/treks').once("value");

export const onceGetResources = () =>
    db.ref('/resources').once("value");

export const onceGetTips = () =>
    db.ref('/tips').once("value");

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetTreksByUser = (user) =>
    db.ref().child('user-posts').child(user)
 
export const doRemoveTrek = (key) => {

    var tags = []

    //remove from treks
    var trekRef = db.ref().child('treks');
    trekRef.once('value', function (snapshot) {
        if (snapshot.hasChild(key)) {
            trekRef.child(key).remove();
        }
    });

    //remove from user treks
    var userPostRef = db.ref().child('user-posts').child(auth.currentUser.email.toLowerCase().replace(/\./g, ','));
    userPostRef.once('value', function (snapshot) {
        if (snapshot.hasChild(key)) {
            if (snapshot.child(key).hasChild('trekTags')) {
                tags = userPostRef.child(key).child('trekTags')
            }            
            userPostRef.child(key).remove();
        }
    });

    //remove from any tag reference
    var tagRef = db.ref().child('tags')
    tagRef.once('value', function (snapshot) {
        if (tags !== null && tags !== undefined) {
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i].toLowerCase().trim()
                if (snapshot.hasChild(tag)) {
                    tagRef.child(tag).child(key).remove();
                }
            }
        }
    });
}