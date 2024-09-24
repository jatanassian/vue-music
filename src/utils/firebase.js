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
  getDoc,
  limit,
  startAfter,
  orderBy
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

export const getUserById = async (id) => {
  const userSnapshot = await getDoc(doc(db, 'users', id));
  return userSnapshot.data();
};

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
    created_at: new Date().toString()
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

export const getSongs = async (lastSongId) => {
  let songsQuery;
  // Initial query on page load
  if (!lastSongId) {
    songsQuery = query(collection(db, 'songs'), orderBy('modified_name'), limit(10));
  }
  // Following queries
  else {
    const lastSongSnapshot = await getDoc(doc(collection(db, 'songs'), lastSongId));
    songsQuery = query(
      collection(db, 'songs'),
      orderBy('modified_name'),
      startAfter(lastSongSnapshot),
      limit(2)
    );
  }
  const songsSnapshot = await getDocs(songsQuery);

  const output = [];
  songsSnapshot.forEach((doc) => output.push({ ...doc.data(), id: doc.id }));
  return output;
};

export const getSongById = async (id) => {
  const songSnapshot = await getDoc(doc(db, 'songs', id));
  return songSnapshot.exists() ? { ...songSnapshot.data(), id } : null;
};

export const getSongsOfUser = async () => {
  const songsQuery = query(collection(db, 'songs'), where('user_id', '==', auth.currentUser.uid));
  const songSnapshots = await getDocs(songsQuery);
  const output = [];
  songSnapshots.forEach((doc) => output.push({ ...doc.data(), id: doc.id }));
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

export const getCommentsOfSong = async (songId) => {
  const commentsQuery = query(collection(db, 'comments'), where('song_id', '==', songId));
  const commentSnapshots = await getDocs(commentsQuery);
  const output = [];
  for (const doc of commentSnapshots.docs) {
    const user = await getUserById(doc.data().user_id);
    output.push({ ...doc.data(), id: doc.id, user: user.name });
  }
  return output;
};

export const createComment = async (songId, text) => {
  const comment = {
    user_id: auth.currentUser.uid,
    song_id: songId,
    text,
    created_at: new Date().toString()
  };

  const commentRef = await addDoc(collection(db, 'comments'), comment);
  const commentSnapshot = await getDoc(commentRef);
  return { ...commentSnapshot.data(), id: commentSnapshot.id, user: auth.currentUser.name };
};
