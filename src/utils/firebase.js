import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

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
export const storage = getStorage();

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

export const signUserOut = async () => {
  await signOut(auth);
};

export const uploadFile = (file) => {
  const songRef = ref(storage, `songs/${file.name}`);
  return uploadBytesResumable(songRef, file);
};

export const createSong = async (snapshot) => {
  const song = {
    user_id: auth.currentUser.uid,
    display_name: auth.currentUser.displayName,
    original_name: snapshot.ref.name,
    modified_name: snapshot.ref.name,
    genre: '',
    comments_count: 0
  };

  song.url = await getDownloadURL(snapshot.ref);
  const songRef = await addDoc(collection(db, 'songs'), song);
  const songSnapshot = await getDoc(songRef);
  return { ...songSnapshot.data(), id: songSnapshot.id };
};

export const getAllSongs = async () => {
  const songsSnapshot = await getDocs(collection(db, 'songs'));
  const output = [];
  songsSnapshot.forEach((doc) => output.push({ ...doc.data(), id: doc.id }));
  return output;
};

export const getSongs = async () => {
  const songsQuery = query(collection(db, 'songs'), where('user_id', '==', auth.currentUser.uid));
  const songsSnapshot = await getDocs(songsQuery);
  const output = [];
  songsSnapshot.forEach((doc) => output.push({ ...doc.data(), id: doc.id }));
  return output;
};

export const updateSong = async (songId, values) => {
  const songRef = doc(db, 'songs', songId);
  await updateDoc(songRef, values);
};

export const deleteSong = async (song) => {
  await deleteObject(ref(storage, `songs/${song.original_name}`));
  await deleteDoc(doc(db, 'songs', song.id));
};
