import {
  initializeApp,
  getApps,
  cert,
  getApp,
  AppOptions,
} from "firebase-admin/app";

const firebaseConfig: AppOptions = {
  credential: cert(JSON.parse(process.env.FIREBASE_CREDENTIALS as string)),
};
export const initializeFirebaseSdk = () => {
  if (!getApps().length) {
    console.log("Initializing new firebase sdk");
    return initializeApp(firebaseConfig);
  } else {
    console.log("Using existing firebase sdk");
    return getApp();
  }
};
