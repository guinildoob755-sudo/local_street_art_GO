
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBrnRKOWdJ9c5eK7Fu6pGk-N-iEp_oqPfs",
  authDomain: "localstreetart-3e41b.firebaseapp.com",
  databaseURL: "https://localstreetart-3e41b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "localstreetart-3e41b",
  storageBucket: "localstreetart-3e41b.firebasestorage.app",
  messagingSenderId: "264651138531",
  appId: "1:264651138531:web:84f79d3c33259448fbacd6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;


