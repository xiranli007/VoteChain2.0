// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import 'firebase/compat/auth';
import { getDatabase } from 'firebase/database';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';


const app = firebase.initializeApp({
  apiKey: "AIzaSyACfzxXAw0gAhV8q0fd7RnUYTic0RqLmaM",
  authDomain: "votechain2.firebaseapp.com",
  projectId: "votechain2",
  storageBucket: "votechain2.firebasestorage.app",
  messagingSenderId: "265740675038",
  appId: "1:265740675038:web:a07586c7d747969ae59f4f",
  measurementId: "G-LN1HWSBYYM"
})
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
export const auth = app.auth()
export const database = getDatabase();
export const firestoreDB = firebase.firestore();
export default app;
export const FieldValue = firebase.firestore.FieldValue;