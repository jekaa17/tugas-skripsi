import React, { useEffect, useState } from "react";
import "./StudentList.css";
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  where,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function StudentList() {
  const { grade, subject } = useParams();
  const [students, setStudents] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0]?.data();
      if (!data) return;
      const role = data.role;
      console.log(data);
      if (role === "admin") {
        setRole("admin");
      } else if (role === "teacher") {
        setRole("teacher");
      } else {
        setRole("student");
      }
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user) fetchUserName();
  }, [user]);

  const getAllStudents = async (subject, grade) => {
    try {
      const q = query(
        collection(db, "users"),
        where("major", "==", subject),
        where("grade", "==", grade)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (err) {
      console.error(err);
      alert("An error occured while get news");
    }
  };

  const getStudentList = async () => {
    const doc = await getAllStudents(subject, grade);
    // setStudents(doc.docs.map((doc) => doc.data()));
    setStudents(doc.docs.map((doc) => ({ docId: doc.id, ...doc.data() })));
  };
  useEffect(() => {
    getStudentList();
  }, []);

  const financeCheck = async (docId, boolean) => {
    console.log(role);

    const docRef = doc(db, "users", `${docId}`);
    const docSnap = await updateDoc(docRef, {
      finance: boolean,
    });
  };

  return (
    <>
      <Navbar />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">NIS</th>
            <th scope="col">Finance</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student, idx) => (
              <tr key={student.nis}>
                <th scope="row">{idx + 1}</th>
                <td>{student.name}</td>
                <td>{student.nis}</td>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={student.finance}
                    onChange={(e) => {
                      financeCheck(student.docId, e.target.checked);
                    }}
                    disabled={role !== "admin"}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default StudentList;
