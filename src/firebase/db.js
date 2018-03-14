import { db } from './firebase';

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

export const onceGetUsers = () =>
  db.ref('users').once('value');
