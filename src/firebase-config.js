import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxDT2ONOIsPn48-hj4yE4RppH560Zekhg",
  authDomain: "mooviestracker.firebaseapp.com",
  projectId: "mooviestracker",
  storageBucket: "mooviestracker.appspot.com",
  messagingSenderId: "175137125913",
  appId: "1:175137125913:web:e95a6d625a83017aca1c88",
  measurementId: "G-7VE81BRV4D"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);