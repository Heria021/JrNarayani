import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRlCqNaipDeXIf6l0uCLFiwj9x9m3nmeE",
  authDomain: "sample-dc006.firebaseapp.com",
  projectId: "sample-dc006",
  storageBucket: "sample-dc006.appspot.com",
  messagingSenderId: "349735856936",
  appId: "1:349735856936:web:303925c76f6cc4c9f77e1d",
  measurementId: "G-68RGMBGMRM"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
export { storage };