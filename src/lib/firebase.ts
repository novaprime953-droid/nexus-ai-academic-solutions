import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAowh_N7AFqhXXWxsBX9o5u81L4xsAT4lU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexus-ai-5ef24.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexus-ai-5ef24",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexus-ai-5ef24.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "395437467971",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:395437467971:web:37c9f5315de38737f2a7f6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VC3PH3KDW7"
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  });
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  type FirebaseUser
};
