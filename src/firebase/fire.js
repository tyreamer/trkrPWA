import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyD1USW-IVZkY5chC_L9ztOVmtKVyAgMVog",
    authDomain: "trekker-2018.firebaseapp.com",
    databaseURL: "https://trekker-2018.firebaseio.com",
    projectId: "trekker-2018",
    storageBucket: "trekker-2018.appspot.com",
    messagingSenderId: "539066344267"
};

export const fire = firebase.initializeApp(config);

export const database = firebase.database();

export const auth = firebase.auth();

export const storageKey = 'TREKKER_LOCAL_STORAGE_KEY'
