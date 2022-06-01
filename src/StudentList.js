import React, { useEffect, useState } from "react";
import { query, collection, getDocs, where, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useParams } from "react-router-dom";
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
    setStudents(doc.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getStudentList();
  }, []);

  return (
    <>
      <table class="table">
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
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default StudentList;
