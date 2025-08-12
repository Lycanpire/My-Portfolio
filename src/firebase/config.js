import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// You'll need to replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDA00QS-NienTFcTWMzA0uYhEcCy6Q42zo",
  authDomain: "my-portfolio-cd4d1.firebaseapp.com",
  projectId: "my-portfolio-cd4d1",
  storageBucket: "my-portfolio-cd4d1.firebasestorage.app",
  messagingSenderId: "691438028995",
  appId: "1:691438028995:web:779fea1bfefdaf8fb87a76",
  measurementId: "G-D7Q5LYCK9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
