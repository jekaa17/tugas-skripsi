import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, getAssignmentByTeacherId } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Register from "./Register";
import { Link } from "react-router-dom";
import NewsForm from "./NewsForm";
import "./AdminDashboard.css";

function AdminDashboard(props) {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [news, setNews] = useState([]);

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
      querySnapshot.forEach((doc) => {
        setNews((news) => [...news, doc.data()]);
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while updating assignment");
    }
  };

  useEffect(() => {
    fetchUserName();
    if (props.userId) updateAssignment();
  }, [user]);

  return (
    <div className="page">
      <div className="heading">
        <div className="name">
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
      <NewsForm userId={props.userId} updateAssignment={updateAssignment} />
      <div className="board">
        <div className="head">
          <h1>Subject ID</h1>
          <h1>Title</h1>
          <h1>Description</h1>
          <div className="empty"></div>
        </div>

        <div className="assignment">
          {news.map((update, index) => (
            <div key={index}>
              <span>{update.title} </span>
              <span>{update.value} </span>
              <span>{update.subjectId}</span>
              <Link
                to={`/teacher/assignment?id=${update.uid}`}
                className="btn btn-outline-primary"
              >
                Readmore
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
