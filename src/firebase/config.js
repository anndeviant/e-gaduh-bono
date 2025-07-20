// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK2Kjb7O33FKnLFKsBkAjwd7rvdVvBpaQ",
  authDomain: "e-gaduh-bono.firebaseapp.com",
  projectId: "e-gaduh-bono",
  storageBucket: "e-gaduh-bono.firebasestorage.app",
  messagingSenderId: "725214218574",
  appId: "1:725214218574:web:f4f3e724d2705058a8761f",
  measurementId: "G-91BY6GCGYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);