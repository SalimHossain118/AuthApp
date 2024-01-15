/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernauthapp-191d0.firebaseapp.com",
  projectId: "mernauthapp-191d0",
  storageBucket: "mernauthapp-191d0.appspot.com",
  messagingSenderId: "1054524669168",
  appId: "1:1054524669168:web:a0cd710a0464f6163c1635",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
