// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "canarent-pl.firebaseapp.com",
  projectId: "canarent-pl",
  storageBucket: "canarent-pl.appspot.com",
  messagingSenderId: "1085790517126",
  appId: "1:1085790517126:web:0928ea81aa5bbee7085e07"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);