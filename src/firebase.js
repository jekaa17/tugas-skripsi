import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0CniFAIZ4KPBFfSwbLuRI5h6u3lzKyk8",
    authDomain: "skripsi-cf882.firebaseapp.com",
    projectId: "skripsi-cf882",
    storageBucket: "skripsi-cf882.appspot.com",
    messagingSenderId: "594967601191",
    appId: "1:594967601191:web:a4104abb11de02189b2e02"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const createNews = async (title, value, subjectId) => {
    try {
      await addDoc(collection(db, "news"), {
        title,
        value,
        subjectId
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while uploading news");
    }
  };

  const getNews = async (subjectId) =>{
    try{
      const q = query(collection(db, "news"), where("subjectId", "==", subjectId));
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (err) {
      console.error(err);
      alert("An error occured while get news");
    }
  }

  const logout = () => {
    signOut(auth);
  };
  export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    getNews,
    createNews,
    
  };
