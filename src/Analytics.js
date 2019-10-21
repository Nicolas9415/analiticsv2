import firebase from "firebase/app";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAgU4vlQ82ikXOoFuntDGLd9LM8n9FiXHk",
  authDomain: "ciclap.firebaseapp.com",
  databaseURL: "https://ciclap.firebaseio.com",
  projectId: "ciclap",
  storageBucket: "ciclap.appspot.com",
  messagingSenderId: "1360841146",
  appId: "1:1360841146:web:d4ecccb1fa8fec441cf583",
  measurementId: "G-VC9GEKFD0F"
});

const db = firebaseApp.firestore();

export default db;
