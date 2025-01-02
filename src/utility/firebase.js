// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAndMWF8oA58_RwAj6c_waoskS2-T-CjLs",
  authDomain: "dashboard-2f133.firebaseapp.com",
  projectId: "dashboard-2f133",
  storageBucket: "dashboard-2f133.firebasestorage.app",
  messagingSenderId: "715189800645",
  appId: "1:715189800645:web:4e7817ac98510a06702aac"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default app