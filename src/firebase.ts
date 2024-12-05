import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBX_9U8UivS3qXrOBKXT2yuEs9Us99DoqM",
  authDomain: "study-ai-d873d.firebaseapp.com",
  projectId: "study-ai-d873d",
  storageBucket: "study-ai-d873d.firebasestorage.app",
  messagingSenderId: "1045128936057",
  appId: "1:1045128936057:web:5427cf4e9cd2768491b2a8",
  measurementId: "G-380TJ3L73X"
};

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;
let firebaseDb: Firestore;

try {
  firebaseApp = getApp();
} catch (e) {
  firebaseApp = initializeApp(firebaseConfig);
}

// Initialize Firebase services
try {
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
} catch (e) {
  console.error('Error initializing Firebase services:', e);
  throw e;
}

// Export initialized instances
export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firebaseDb;
export const googleProvider = new GoogleAuthProvider();