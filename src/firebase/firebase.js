import * as firebase from 'firebase';

const prodConfig = {
    apiKey: "AIzaSyD1USW-IVZkY5chC_L9ztOVmtKVyAgMVog",
    authDomain: "trekker-2018.firebaseapp.com",
    databaseURL: "https://trekker-2018.firebaseio.com",
    projectId: "trekker-2018",
    storageBucket: "trekker-2018.appspot.com",
    messagingSenderId: "539066344267"
};

const config = prodConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth
};
