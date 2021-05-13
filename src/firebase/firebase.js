import firebase from 'firebase/app'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyCFIi583niKguAPxd3DaqOIMSnqQrdaprE",
    authDomain: "radio-f1797.firebaseapp.com",
    databaseURL: "https://radio-f1797-default-rtdb.firebaseio.com",
    projectId: "radio-f1797",
    storageBucket: "radio-f1797.appspot.com",
    messagingSenderId: "1063841241525",
    appId: "1:1063841241525:web:00c98e980da40201b221fc",
    measurementId: "G-8L6BCYFEH7"
  };
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()

export {
    db,
}
