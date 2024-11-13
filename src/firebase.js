import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACfzxXAw0gAhV8q0fd7RnUYTic0RqLmaM",
  authDomain: "votechain2.firebaseapp.com",
  projectId: "votechain2",
  storageBucket: "votechain2.firebasestorage.app",
  messagingSenderId: "265740675038",
  appId: "1:265740675038:web:a07586c7d747969ae59f4f",
  measurementId: "G-LN1HWSBYYM"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAc_-OdAVpjxFq23aAK9ePvAFjEGnFWtYE",
//   authDomain: "votechain2-bbf59.firebaseapp.com",
//   projectId: "votechain2-bbf59",
//   storageBucket: "votechain2-bbf59.firebasestorage.app",
//   messagingSenderId: "681050617389",
//   appId: "1:681050617389:web:012eec76c8a173c136eaa4",
//   measurementId: "G-QEZ5JH41X1"
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export { app,auth };