import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, getAssignmentByTeacherId } from "./firebase";
import {
  doc,
  query,
  collection,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import Register from "./Register";
import { Link } from "react-router-dom";
import NewsForm from "./NewsForm";
import { formatDate } from "./utils/DateHelper";
import "./AdminDashboard.css";
import Navbar from "./Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used

function AdminDashboard(props) {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [news, setNews] = useState([]);
  const [gradeTenToggle, setGradeTenToggle] = useState(true);
  const [gradeElevenToggle, setGradeElevenToggle] = useState(true);
  const [gradeTwelveToggle, setGradeTwelveToggle] = useState(true);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setRole(data.role);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const updateAssignment = async () => {
    try {
      setNews([]);
      const querySnapshot = await getAssignmentByTeacherId(props.userId);
      querySnapshot.forEach((doc) => {
        setNews((news) => [...news, doc.data()]);
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while updating assignment");
    }
  };

  const deleteAssignment = async (uid) => {
    try {
      await deleteDoc(doc(db, "news", uid));
      await updateAssignment();
      alert("Assignment deleted");
    } catch (err) {
      alert("An error occured while deleting assignment");
    }
  };

  const titleCase = (string) => {
    if (!string) return;
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchUserName();
    if (props.userId) updateAssignment();
  }, [user]);

  return (
    <>
      <Navbar />
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
            <h1>{titleCase(role)} Dashboard</h1>
          </div>
          <div className="log">
            <h2>Logged In As {titleCase(role)}</h2>
            <button className="dashboard__btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="underline"></div>

        {role === "admin" && <Register />}
        {role === "teacher" && (
          <div>
            <NewsForm
              type="assignment"
              userId={props.userId}
              updateDocument={updateAssignment}
            />
            <div className="assignment-container">
              <h2>Grade 10 assignments</h2>
              <div
                className="toggle-button"
                onClick={() => setGradeTenToggle((value) => !value)}
              >
                {gradeTenToggle ? (
                  <>
                    View
                    <FontAwesomeIcon icon={solid("chevron-down")} />
                  </>
                ) : (
                  <>
                    Hide
                    <FontAwesomeIcon icon={solid("chevron-up")} />
                  </>
                )}
              </div>
              {!gradeTenToggle ? (
                <div className="board">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Subject ID</th>
                        <th scope="col">Grade </th>
                        <th scope="col">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news
                        .filter((singleNews) => singleNews.grade === "X")
                        .sort(function (a, b) {
                          return b.dueDate.toDate() - a.dueDate.toDate();
                        })
                        .map((update, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{update.title} </td>
                            <td>{update.value} </td>
                            <td>{update.subjectId}</td>
                            <td>{update.grade}</td>
                            {update?.dueDate && (
                              <td>{formatDate(update?.dueDate.toDate())}</td>
                            )}
                            <Link
                              to={`/teacher/assignment?id=${update.uid}`}
                              className="btn-readmore "
                            >
                              Readmore
                            </Link>
                            <button
                              className="del-btn"
                              onClick={() => deleteAssignment(update.uid)}
                            >
                              Delete
                            </button>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="assignment"></div>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="assignment-container">
              <h2>Grade 11 assignments</h2>
              <div
                className="toggle-button"
                onClick={() => setGradeElevenToggle((value) => !value)}
              >
                {gradeElevenToggle ? (
                  <>
                    View
                    <FontAwesomeIcon icon={solid("chevron-down")} />
                  </>
                ) : (
                  <>
                    Hide
                    <FontAwesomeIcon icon={solid("chevron-up")} />
                  </>
                )}
              </div>
              {!gradeElevenToggle ? (
                <div className="board">
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Subject ID</th>
                        <th scope="col">Grade </th>
                        <th scope="col">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news
                        .filter((singleNews) => singleNews.grade === "XI")
                        .sort(function (a, b) {
                          return b.dueDate.toDate() - a.dueDate.toDate();
                        })
                        .map((update, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{update.title} </td>
                            <td>{update.value} </td>
                            <td>{update.subjectId}</td>
                            <td>{update.grade}</td>
                            {update?.dueDate && (
                              <td>{formatDate(update?.dueDate.toDate())}</td>
                            )}
                            <Link
                              to={`/teacher/assignment?id=${update.uid}`}
                              className="btn-readmore "
                            >
                              Readmore
                            </Link>
                            <button
                              className="del-btn"
                              onClick={() => deleteAssignment(update.uid)}
                            >
                              Delete
                            </button>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="assignment"></div>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="assignment-container">
              <h2>Grade 12 assignments</h2>
              <div
                className="toggle-button"
                onClick={() => setGradeTwelveToggle((value) => !value)}
              >
                {gradeTwelveToggle ? (
                  <>
                    View
                    <FontAwesomeIcon icon={solid("chevron-down")} />
                  </>
                ) : (
                  <>
                    Hide
                    <FontAwesomeIcon icon={solid("chevron-up")} />
                  </>
                )}
              </div>
              {!gradeTwelveToggle ? (
                <div className="board">
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Subject ID</th>
                        <th scope="col">Grade </th>
                        <th scope="col">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news
                        .filter((singleNews) => singleNews.grade === "XII")
                        .sort(function (a, b) {
                          return b.dueDate.toDate() - a.dueDate.toDate();
                        })
                        .map((update, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{update.title} </td>
                            <td>{update.value} </td>
                            <td>{update.subjectId}</td>
                            <td>{update.grade}</td>
                            {update?.dueDate && (
                              <td>{formatDate(update?.dueDate.toDate())}</td>
                            )}
                            <Link
                              to={`/teacher/assignment?id=${update.uid}`}
                              className="btn-readmore "
                            >
                              Readmore
                            </Link>
                            <button
                              className="del-btn"
                              onClick={() => deleteAssignment(update.uid)}
                            >
                              Delete
                            </button>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="assignment"></div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default AdminDashboard;
