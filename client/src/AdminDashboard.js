import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, getAssignmentByTeacherId } from "./firebase";
import { doc, query, collection, getDocs, where, deleteDoc } from "firebase/firestore";
import Register from "./Register";
import { Link } from "react-router-dom";
import NewsForm from "./NewsForm";
import { formatDate } from "./utils/DateHelper";
import "./AdminDashboard.css";
import Navbar from "./Navbar/Navbar";
import StudentTimetable from "./StudentTimetable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

function AdminDashboard(props) {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [news, setNews] = useState([]);
  const [gradeTenAssignments, setGradeTenAssignments] = useState([]);
  const [gradeElevenAssignments, setGradeElevenAssignments] = useState([]);
  const [gradeTwelveAssignments, setGradeTwelveAssignments] = useState([]);
  const [gradeTenToggle, setGradeTenToggle] = useState(true);
  const [gradeElevenToggle, setGradeElevenToggle] = useState(true);
  const [gradeTwelveToggle, setGradeTwelveToggle] = useState(true);


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

  const updateAssignment = async () => {
    try {
      setNews([]);
      const querySnapshot = await getAssignmentByTeacherId(props.userId);
      await querySnapshot.forEach((doc) => {
        setNews((news) => [...news, doc.data()]);
      });
      const gradeTenNews = news.filter((singleNews) => singleNews.grade === 'X');
      const gradeElevenNews = news.filter((singleNews) => singleNews.grade === 'XI');
      const gradeTwelveNews = news.filter((singleNews) => singleNews.grade === 'XII')
      setGradeTenAssignments(gradeTenNews);
      setGradeElevenAssignments(gradeElevenNews);
      setGradeTwelveAssignments(gradeTwelveNews);
      console.log(gradeTenAssignments);
      console.log(gradeElevenAssignments);
      console.log(gradeTwelveAssignments);
    } catch (err) {
      console.error(err);
      alert("An error occured while updating assignment");
    }
  };

  const deleteAssignment = async(uid) => {
    try {
      await deleteDoc(doc(db, "news", uid));
      await updateAssignment();
      alert("Assignment deleted");
    } catch (err) {
      alert("An error occured while deleting assignment")
    }
  }

  useEffect(() => {
    fetchUserName();
    if (props.userId) updateAssignment();
  }, [user]);

  return (
    <>
      <Navbar role="admin" />
      <div className="page">
        <div className="heading">
          <div className="name">
            <div className="image-logo">
              <img src="./images/pscn.png" alt="teacher" />
            </div>
            <div>{name}</div>
            <div>{user?.email}</div>
          </div>
          <div className="title">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="log">
            <h2>Logged In As Admin</h2>
            <button className="dashboard__btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="underline"></div>

        <Register />
        <NewsForm
          type="assignment"
          userId={props.userId}
          updateDocument={updateAssignment}
        />
        <StudentTimetable />
        <div>
          <h2>Grade 10 assignments</h2>
          <div className='toggle-button' onClick={() => setGradeTenToggle((value) => !value)}>
            View
            {gradeTenToggle ? 
              <FontAwesomeIcon icon={solid('chevron-down')} />
              :
              <FontAwesomeIcon icon={solid('chevron-up')} />
            }
          </div>
          {!gradeTenToggle ? (
            <div className="board">
              <div className="head">
                <h1>Title</h1>
                <h1>Description</h1>
                <h1>Subject Id</h1>
                <h1>Grade</h1>
                <h1>Due Date</h1>
                <div className="empty"></div>
              </div>
              <div className="assignment">
                {gradeTenAssignments.map((update, index) => (
                  <div key={index}>
                    <span>{update.title} </span>
                    <span>{update.value} </span>
                    <span>{update.subjectId}</span>
                    <span>{update.grade}</span>
                    {update?.dueDate && (
                      <span>{formatDate(update?.dueDate.toDate())}</span>
                    )}
                    <Link
                      to={`/teacher/assignment?id=${update.uid}`}
                      className="btn btn-outline-primary"
                    >
                      Readmore
                    </Link>
                    <button onClick={() => deleteAssignment(update.uid)}>Delete</button>
                  </div>
                ))}
              </div>
          </div>
          ):
          (<></>)
          }
        </div>
        
        <div> 
          <h2>Grade 11 assignments</h2>
          <div className='toggle-button' onClick={() => setGradeElevenToggle((value) => !value)}>
            View
            {gradeElevenToggle ? 
              <FontAwesomeIcon icon={solid('chevron-down')} />
              :
              <FontAwesomeIcon icon={solid('chevron-up')} />
            }
          </div>
          {!gradeElevenToggle ? (
            <div className="board">
              <div className="head">
                <h1>Title</h1>
                <h1>Description</h1>
                <h1>Subject Id</h1>
                <h1>Grade</h1>
                <h1>Due Date</h1>
                <div className="empty"></div>
              </div>
              <div className="assignment">
                {gradeElevenAssignments.map((update, index) => (
                  <div key={index}>
                    <span>{update.title} </span>
                    <span>{update.value} </span>
                    <span>{update.subjectId}</span>
                    <span>{update.grade}</span>
                    {update?.dueDate && (
                      <span>{formatDate(update?.dueDate.toDate())}</span>
                    )}
                    <Link
                      to={`/teacher/assignment?id=${update.uid}`}
                      className="btn btn-outline-primary"
                    >
                      Readmore
                    </Link>
                    <button onClick={() => deleteAssignment(update.uid)}>Delete</button>
                  </div>
                ))}
              </div>
          </div>
          ):
          (<></>)
          }
        </div>

        <div>
          <h2>Grade 12 assignments</h2>
          <div className='toggle-button' onClick={() => setGradeTwelveToggle((value) => !value)}>
            View
            {gradeTwelveToggle ? 
              <FontAwesomeIcon icon={solid('chevron-down')} />
              :
              <FontAwesomeIcon icon={solid('chevron-up')} />
            }
          </div>
          {!gradeTwelveToggle ? (
            <div className="board">
              <div className="head">
                <h1>Title</h1>
                <h1>Description</h1>
                <h1>Subject Id</h1>
                <h1>Grade</h1>
                <h1>Due Date</h1>
                <div className="empty"></div>
              </div>
              <div className="assignment">
                {gradeTwelveAssignments.map((update, index) => (
                  <div key={index}>
                    <span>{update.title} </span>
                    <span>{update.value} </span>
                    <span>{update.subjectId}</span>
                    <span>{update.grade}</span>
                    {update?.dueDate && (
                      <span>{formatDate(update?.dueDate.toDate())}</span>
                    )}
                    <Link
                      to={`/teacher/assignment?id=${update.uid}`}
                      className="btn btn-outline-primary"
                    >
                      Readmore
                    </Link>
                    <button onClick={() => deleteAssignment(update.uid)}>Delete</button>
                  </div>
                ))}
              </div>
          </div>
          ):
          (<></>)
          }
        </div>
        {/* <div className="board">
          <div className="head">
            <h1>Title</h1>
            <h1>Description</h1>
            <h1>Subject Id</h1>
            <h1>Grade</h1>
            <h1>Due Date</h1>
            <div className="empty"></div>
          </div>

          <div className="assignment">
            {news.map((update, index) => (
              <div key={index}>
                <span>{update.title} </span>
                <span>{update.value} </span>
                <span>{update.subjectId}</span>
                <span>{update.grade}</span>
                {update?.dueDate && (
                  <span>{formatDate(update?.dueDate.toDate())}</span>
                )}
                <Link
                  to={`/teacher/assignment?id=${update.uid}`}
                  className="btn btn-outline-primary"
                >
                  Readmore
                </Link>
                <button onClick={() => deleteAssignment(update.uid)}>Delete</button>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}
export default AdminDashboard;
