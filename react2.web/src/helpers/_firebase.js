import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBDVgELSaiPsUxlY8hPa5SZXEzDt8t1gAg",
    authDomain: "abetech-app.firebaseapp.com",
    databaseURL: "https://abetech-app.firebaseio.com",
    projectId: "abetech-app",
    storageBucket: "abetech-app.appspot.com",
    messagingSenderId: "250630133346",
    appId: "1:250630133346:web:c17dfb5f130edbff26633b",
    measurementId: "G-5T49JHLCHN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();