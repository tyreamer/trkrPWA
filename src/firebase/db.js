import { db } from './firebase';
import { auth } from './'

function cleanUsername(username) {
    return username.toLowerCase().replace(/\./g, ',');
}

// User API

export const doCreateUser = (username, email) => {
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

export const updateUsername = (oldUsername, newUsername) => {
    if (oldUsername === "" ||
        oldUsername === null ||
        newUsername === "" ||
        newUsername === null) {
        console.log('missing old or new username')
        return
    }
        
    var success = true;
    var errors = []
    return new Promise(function (resolve, reject) {
        
        //Users
        /* Copy the old user data into a new node and delete the old one */
        var usersRef = db.ref('users')
        var childRef = usersRef.child(oldUsername)
        
        childRef.once('value').then(function (snapshot) {            
                var updates = {};
                updates[oldUsername] = null;
                updates[newUsername] = snapshot.val();
            
                usersRef.update(updates);
            })
            .then(()=> {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            })
        
        //Resources
        /* Update the existing post with the new username */
        db.ref('resources')
            .orderByChild("user")
            .equalTo(oldUsername)
            .once('value')
            .then((snapshot) => {
                snapshot.forEach(function (post) {
                    db.ref('resources').child(post.key).update({ user: newUsername })
                })
            })
            .then(() => {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            })

        //User Resources
        /* Copy the old user data into a new node and delete the old one */
        var userResourcesRef = db.ref('user-resources')
        var userResourcesChildRef = userResourcesRef.child(oldUsername)
        userResourcesChildRef.once('value').then(function (snapshot) {
            var updates = {};
            updates[oldUsername] = null;
            updates[newUsername] = snapshot.val();
            userResourcesRef.update(updates);
            })
            .then(() => {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            })

        //User Resources Children
        /* Update the existing post with the new username */
        db.ref('user-resources')
            .orderByChild("user")
            .equalTo(oldUsername)
            .once('value')
            .then((snapshot) => {
                snapshot.forEach(function (post) {
                    db.ref('user-resources').child(post.key).update({ user: newUsername })
                })
            })
            .then(() => {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            })

        //Treks
        /* Update the existing post with the new username */
        db.ref('treks')
            .orderByChild("user")
            .equalTo(oldUsername)
            .once('value')
            .then((snapshot) => {
                snapshot.forEach(function (post) {
                    db.ref('treks').child(post.key).update({ user: newUsername })
                })
            })
            .then(() => {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            })

        //User Posts
        /* Copy the old user data into a new node and delete the old one */
        var userPostsRef = db.ref('user-posts')
        var userPostsChildRef = userPostsRef.child(oldUsername)
        userPostsChildRef.once('value').then(function (snapshot) {
            var updates = {};
            updates[oldUsername] = null;
            updates[newUsername] = snapshot.val();
            userPostsRef.update(updates);
        })
        .then(() => {
            success = success && true
        })
        .catch((e) => {
            success = success && false
            errors.push(e)
        })

        //User Posts Children
        /* Update the existing post with the new username */
        db.ref('user-posts')
            .orderByChild("user")
            .equalTo(oldUsername)
            .once('value')
            .then((snapshot) => {
                snapshot.forEach(function (post) {
                    db.ref('user-posts').child(post.key).update({ user: newUsername })
                })
            })
            .then(() => {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            }) 

        //Tips
        /* Update the existing post with the new username */
        db.ref('tips')
            .orderByChild("user")
            .equalTo(oldUsername)
            .once('value')
            .then((snapshot) => {
                snapshot.forEach(function (post) {
                    db.ref('tips').child(post.key).update({ user: newUsername })
                })
            })
            .then(() => {
                success = success && true
            })
            .catch((e) => {
                success = success && false
                errors.push(e)
            })

        //User Tips
        /* Copy the old user data into a new node and delete the old one */
        var userTipsRef = db.ref('user-tips')
        var userTipsChildRef = userTipsRef.child(oldUsername)
        userTipsChildRef.once('value').then(function (snapshot) {
            var updates = {};
            updates[oldUsername] = null;
            updates[newUsername] = snapshot.val();
            userTipsRef.update(updates);
        })
        .then(() => {
            success = success && true
        })
        .catch((e) => {
            success = success && false
            errors.push(e)
        })

        //Likes
        /* Get all the posts that are liked by this user then replace the child key with the new key */
        var userLikesRef = db.ref('likes')
        userLikesRef.once('value').then(function (snapshot) {
            snapshot.forEach((child) => {
                if (child.hasChild(oldUsername)) {
                    var updates = {};
                    updates[oldUsername] = null;
                    updates[newUsername] = child.val()[oldUsername];
                    userLikesRef.child(child.key).update(updates);
                }
            })
        })
        .then(() => {
            success = success && true
        })
        .catch((e) => {
            success = success && false
            errors.push(e)
        })

        return success ? resolve() : reject(errors)
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
    var userPostRef = db.ref().child('user-posts').child(auth.currentUser());
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