import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
   db.ref(`users/${email.toLowerCase().replace(/\./g, ',')}`).set({
    displayName: username,
    email: email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other db APIs ...
