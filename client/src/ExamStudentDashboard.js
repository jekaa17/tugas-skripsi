import React, { useEffect, useState } from "react";
import "./ExamStudentDashboard.css";
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
  const [major, setMajor] = useState("");
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
      setMajor(data.major);
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
      <>
        <Navbar />
        <div className="finance-error-container">
          <div className="finance-error">
            <a href="">
              <img
                className="temp-img"
                src="./images/triangle-exclamation-solid.svg"
                alt="alert"
              />
            </a>
            <p>
              {" "}
              There is outstanding invoice that has yet to pay. If it is
              mistaken, contact to your student centre by calling or emailing
              them!
            </p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="heading">
          <div className="name">
            <div>{name}</div>
            <div>{grade}</div>
            <div>{major}</div>
            <div>{user?.email}</div>
          </div>
          <div className="title">
            <h1>Exams</h1>
          </div>
          <div className="log">
            <h2>Logged In As Student</h2>
            <button className="dashboard__btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="underline"></div>

        <div className="board-container-exam">
          <div className="board">
            <h1>Exams</h1>
            <div className="board-examteacher">
              <table class="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Subject ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {exams
                    .filter(
                      (update) => !checkPassDueDate(update?.dueDate.toDate())
                    )
                    .map((update, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{update?.subjectId}</td>
                        <td>{update?.title}</td>
                        <td>{update?.value}</td>
                        {update?.dueDate && (
                          <td>{formatDate(update?.dueDate.toDate())}</td>
                        )}
                        <button
                          className="btn btn-link btn-outline-primary text-decoration-none"
                          onClick={() => toExamDetails(update)}
                        >
                          Read More
                        </button>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ExamStudentDashboard;
