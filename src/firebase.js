import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfigProd = {
  apiKey: process.env.REACT_APP_FIREBASE_PROD_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_PROD_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_PROD_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_PROD_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_PROD_MEASUREMENT_ID
};

const keys = () => {
  return firebaseConfigProd;
};

const firebaseConfig = keys();

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export const storage = getStorage(app);
export default app;
export { auth };
export const db = getDatabase(app);
export { analytics };
