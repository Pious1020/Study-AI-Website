import { FirebaseApp, initializeApp, getApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function initializeFirebase() {
  try {
    firebaseApp = getApp();
  } catch {
    firebaseApp = initializeApp({
      apiKey: "AIzaSyBX_9U8UivS3qXrOBKXT2yuEs9Us99DoqM",
      authDomain: "study-ai.live",
      projectId: "study-ai-d873d",
      storageBucket: "study-ai-d873d.firebasestorage.app",
      messagingSenderId: "1045128936057",
      appId: "1:1045128936057:web:5427cf4e9cd2768491b2a8",
      measurementId: "G-380TJ3L73X"
    });
  }

  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);

  return { app: firebaseApp, auth, db };
}

export function getFirebaseApp() {
  if (!firebaseApp) throw new Error('Firebase not initialized');
  return firebaseApp;
}

export function getFirebaseAuth() {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return auth;
}

export function getFirebaseDb() {
  if (!db) throw new Error('Firestore not initialized');
  return db;
}
