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
import { db } from "./firebase";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
function StudentList() {
  const { grade, subject } = useParams();
  const [students, setStudents] = useState([]);
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
    const docRef = doc(db, "users", `${docId}`);
    const docSnap = await updateDoc(docRef, {
      finance: boolean,
    });
  };

  return (
    <>
      <Navbar role="admin" />
      <table class="table">
        <thead >
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
                    onChange={(e) =>
                      financeCheck(student.docId, e.target.checked)
                    }
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
