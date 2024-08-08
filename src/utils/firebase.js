import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
 * Create user in Firebase Authentication.
 *
 * @param {string} email
 * @param {string} password
 * @return {any}
 */
export const createAuthUserWIthEmailAndPassword = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Create user in the Firestore Database.
 *
 * @param {any} authUser
 * @param {any} user
 * @return {void}
 */
export const createUserDocument = async (authUser, user) => {
  const userRef = await doc(db, 'users', authUser.id);
  await setDoc(userRef, {
    name: user.name,
    email: user.email,
    age: user.age,
    country: user.country,
    createdAt: new Date()
  });
};
