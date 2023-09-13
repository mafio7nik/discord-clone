import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAehS-kCTgRLdLVqcs2-2I1ouGUIICwiWE",
  authDomain: "discord-clone-398716.firebaseapp.com",
  projectId: "discord-clone-398716",
  storageBucket: "discord-clone-398716.appspot.com",
  messagingSenderId: "979027779046",
  appId: "1:979027779046:web:9a051392bc97ff79544a27",
  measurementId: "G-CTQ1FCE9EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app, "gs://discord-clone-398716.appspot.com");