import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();

/**
 * Register user in database
 *
 * @param userData
 */
export const registerUser = async (userData) => {
  // Create user in Firebase Authentication
  const authUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

  // Create user document in the Firestore Database
  const userRef = await doc(db, 'users', authUser.user.uid);
  await setDoc(userRef, {
    name: userData.name,
    email: userData.email,
    age: userData.age,
    country: userData.country,
    createdAt: new Date()
  });
};

export const authenticateUser = async ({ email, password }) => {
  await signInWithEmailAndPassword(auth, email, password);
};
