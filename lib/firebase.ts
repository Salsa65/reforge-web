import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const config={
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured=Boolean(config.apiKey&&config.authDomain&&config.projectId&&config.appId);
export const firebaseApp:FirebaseApp|null=isFirebaseConfigured?(getApps()[0]??initializeApp(config)):null;
export const firebaseAuth:Auth|null=firebaseApp?getAuth(firebaseApp):null;
export const firestore:Firestore|null=firebaseApp?getFirestore(firebaseApp):null;
export const firebaseStorage:FirebaseStorage|null=firebaseApp?getStorage(firebaseApp):null;
