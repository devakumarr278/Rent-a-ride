// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rent-a-car-1a3fc.firebaseapp.com",
  projectId: "rent-a-car-1a3fc",
  storageBucket: "rent-a-car-1a3fc.firebasestorage.app",
  messagingSenderId: "408219908458",
  appId: "1:408219908458:web:92fbb660f8a115251b4d13",
  measurementId: "G-7VZGK58PE8"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export { app };