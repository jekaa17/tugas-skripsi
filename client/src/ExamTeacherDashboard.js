import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, getExamByTeacherId } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import NewsForm from "./NewsForm";
import { formatDate } from "./utils/DateHelper";
import "./AdminDashboard.css";
import Navbar from "./Navbar/Navbar";

function ExamTeacherDashboard(props) {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const updateExam = async () => {
    try {
      setExams([]);
      const querySnapshot = await getExamByTeacherId(user?.uid);
      querySnapshot.forEach((doc) => {
        setExams((exams) => [...exams, doc.data()]);
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while updating exam");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user?.uid) {
      fetchUserName();
      updateExam();
    }
  }, [user?.uid]);

  if (!user?.uid) return <></>;

  return (
    <>
      <Navbar role="admin" />
      <div className="page">
        <div className="heading">
          <div className="name">
            <div class="image-logo">
              <img src="./images/pscn.png" alt="teacher" />
            </div>
            <div>{name}</div>
            <div>{user?.email}</div>
          </div>
          <div className="title">
            <h1>Exam Dashboard</h1>
          </div>
          <div className="log">
            <h2>Logged In As Admin</h2>
            <button className="dashboard__btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="underline"></div>

        <NewsForm type="exam" userId={user?.uid} updateDocument={updateExam} />
        <div className="board">
          <div className="head">
            <h1>Subject ID</h1>
            <h1>Title</h1>
            <h1>Description</h1>
            <h1>Due Date</h1>
            <div className="empty"></div>
          </div>

          <div className="assignment">
            {exams.map((exam, index) => (
              <div key={index}>
                <span>{exam.title} </span>
                <span>{exam.value} </span>
                <span>{exam.subjectId}</span>
                {exam?.dueDate && (
                  <span>{formatDate(exam?.dueDate.toDate())}</span>
                )}
                <Link
                  to={`/exam-teacher/details?id=${exam.uid}`}
                  className="btn btn-outline-primary"
                >
                  Readmore
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default ExamTeacherDashboard;
