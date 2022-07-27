import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VUE_APP_FIREBASE_APP_ID,
};

export default firebase.initializeApp(firebaseConfig);
