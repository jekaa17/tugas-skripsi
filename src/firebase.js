import {initializeApp} from "firebase/app";
import { getStorage } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
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
  setDoc,
  getDocs,
  query,
  where,
  doc
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
const storage = getStorage(app);
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

const registerWithEmailAndPassword = async (name, email, password, subject) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // let subjects = ["Bahasa Indonesia","Mat"];
      const user = res.user;
      // if(subject === "IPA")
      //   subjects.push("IPA")
      // if(subject==="IPS")
      //   subjects.push("IPS")
      
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        subjects:(subject === "IPA") ? ["Bahasa Indonesia","Mat","IPA"] : ["Bahasa Indonesia","Mat","IPS"]
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const createNews = async (title, value, subjectId, teacherId ) => {
    try {
      const uid = uuidv4();
      await setDoc(doc(db, "news", uid), {
        title,
        value,
        subjectId,
        uid,
        teacherId
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while uploading news");
    }
  };

  const getNewsbyId = async (id) =>{
    try{
      const q = query(collection(db, "news"), where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (err) {
      console.error(err);
      alert("An error occured while get news");
    }
  }

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

  const getAssignmentByTeacherId= async (teacherId) =>{
    try{
      const q = query(collection(db, "news"), where("teacherId", "==", teacherId));
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (err) {
      console.error(err);
      alert("An error occured while get teacherId");
    }
  }

  const logout = () => {
    signOut(auth);
  };
  export {
    auth,
    db,
    app,
    storage,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    getNews,
    getNewsbyId,
    getAssignmentByTeacherId,
    createNews
  };
