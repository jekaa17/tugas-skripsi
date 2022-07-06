import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0CniFAIZ4KPBFfSwbLuRI5h6u3lzKyk8",
  authDomain: "skripsi-cf882.firebaseapp.com",
  projectId: "skripsi-cf882",
  storageBucket: "skripsi-cf882.appspot.com",
  messagingSenderId: "594967601191",
  appId: "1:594967601191:web:a4104abb11de02189b2e02",
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

const registerWithEmailAndPassword = async (
  name,
  email,
  password,
  grade,
  subject,
  nis
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      grade,
      nis,
      authProvider: "local",
      email,
      finance: "false",
      major: subject,
      subjects:
        subject === "IPA"
          ? ["Bahasa Indonesia", "Mat", "IPA"]
          : ["Bahasa Indonesia", "Mat", "IPS"],
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const createNews = async (
  title,
  value,
  grade,
  subjectId,
  dueDate,
  teacherId
) => {
  try {
    const uid = uuidv4();
    await setDoc(doc(db, "news", uid), {
      title,
      value,
      grade,
      subjectId,
      dueDate,
      uid,
      teacherId,
    });
  } catch (err) {
    console.error(err);
    alert("An error occured while uploading news");
  }
};

const createExam = async (
  title,
  value,
  grade,
  subjectId,
  dueDate,
  teacherId
) => {
  try {
    const uid = uuidv4();
    await setDoc(doc(db, "exams", uid), {
      title,
      value,
      grade,
      subjectId,
      dueDate,
      uid,
      teacherId,
    });
  } catch (err) {
    console.error(err);
    alert("An error occured while uploading exams");
  }
};

const getNewsbyId = async (id) => {
  try {
    const q = query(collection(db, "news"), where("uid", "==", id));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (err) {
    console.error(err);
    alert("An error occured while get news");
  }
};

const getExamsById = async (id) => {
  try {
    const q = query(collection(db, "exams"), where("uid", "==", id));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (err) {
    console.error(err);
    alert("An error occured while get exams");
  }
};

const getNews = async (subjectId, grade) => {
  try {
    console.log(subjectId, "subjectid", grade, "grade");
    const q = query(
      collection(db, "news"),
      where("subjectId", "==", subjectId),
      where("grade", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (err) {
    console.error(err);
    alert("An error occured while get news");
  }
};

const getExams = async (subjectId, grade) => {
  try {
    const q = query(
      collection(db, "exams"),
      where("subjectId", "==", subjectId),
      where("grade", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (err) {
    console.error(err);
    alert("An error occured while get news");
  }
};

const getAssignmentByTeacherId = async (teacherId) => {
  try {
    const q = query(
      collection(db, "news"),
      where("teacherId", "==", teacherId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (err) {
    console.error(err);
    alert("An error occured while get teacherId");
  }
};

const getExamByTeacherId = async (teacherId) => {
  try {
    const q = query(
      collection(db, "exams"),
      where("teacherId", "==", teacherId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (err) {
    console.error(err);
    alert("An error occured while get teacherId");
  }
};

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
  getExams,
  getNewsbyId,
  getExamsById,
  getAssignmentByTeacherId,
  getExamByTeacherId,
  createNews,
  createExam,
};