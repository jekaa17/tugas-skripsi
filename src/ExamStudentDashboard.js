import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, logout, getExams } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { formatDate, checkPassDueDate } from "./utils/DateHelper";
import Navbar from "./Navbar/Navbar";

function ExamStudentDashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [grade, setGrade] = useState("");
  const [finance, setFinance] = useState();
  const navigate = useNavigate();

  const toExamDetails = (update) => {
    navigate(`/exam-student/details?id=${update.uid}`, {
      state: { name: name },
    });
  };

  const fetchUserDetails = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setSubjects(data.subjects);
      setGrade(data.grade);
      setFinance(data.finance);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchExam = async () => {
    try {
      const grabExams = async (subject, grade) => {
        const doc = await getExams(subject, grade);
        return doc.docs.map((doc) => doc.data());
      };
      const getData = async () => {
        return Promise.all(
          subjects.map((subject) => grabExams(subject, grade))
        );
      };
      getData().then((updates) => {
        updates.map((update) =>
          update.map((singleUpdate) =>
            setExams((exams) => [...exams, singleUpdate])
          )
        );
      });
    } catch (err) {
      console.error(err);
      alert("error while load news");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserDetails();
  }, [user, loading]);

  useEffect(() => {
    if (!subjects) return;
    if (!grade) return;
    fetchExam();
  }, [subjects, grade]);

  if (!finance)
    return (
      <div>
        There is outstanding invoice that has yet to pay. If it is mistaken,
        contact to your student centre by calling or emailing them
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="heading">
          <div className="name">
            <div>{name}</div>
            <div>{user?.email}</div>
          </div>
          <div className="title">
            <h1>Student Dashboard</h1>
          </div>
          <div className="log">
            <h2>Logged In As Student</h2>
            <button className="dashboard__btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="underline"></div>

        <div className="board-container">
          <div className="board-left">
            <h1>Exams</h1>
            <div className="assignments">
              {exams
                .filter((update) => !checkPassDueDate(update?.dueDate.toDate()))
                .map((update, index) => (
                  <div key={index}>
                    <span>{update?.subjectId}</span>
                    <span>{update?.title}</span>
                    {/* <span>{update?.value}</span> */}
                    {console.log(
                      checkPassDueDate(update?.dueDate.toDate()),
                      "DATE"
                    )}
                    {update?.dueDate && (
                      <span>{formatDate(update?.dueDate.toDate())}</span>
                    )}
                    <button
                      className="btn btn-link btn-outline-primary text-decoration-none"
                      onClick={() => toExamDetails(update)}
                    >
                      Read More
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ExamStudentDashboard;
