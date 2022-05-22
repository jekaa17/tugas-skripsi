import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./StudentDashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, logout, getNews } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { formatDate, checkPassDueDate } from "./utils/DateHelper";

//a custom hook that builds on useLocation to parse
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function SubjectDashboard() {
  let queryParam = useQuery();
  const subjectId = queryParam.get("subject");

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  const toAssgDetails = (update) => {
    navigate(`/assignment?id=${update.uid}`, { state: { name: name } });
  };

  const fetchUserDetails = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setSubjects(data.subjects);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchNews = async (subjectId) => {
    try {
      const grabNews = async (subjectId) => {
        const doc = await getNews(subjectId);
        return doc.docs.map((doc) => doc.data());
      };
      const getData = async () => {
        return grabNews(subjectId);
      };
      getData().then((updates) => {
        updates.map((update) => setNews((news) => [...news, update]));
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
    if (!subjectId) return;
    fetchNews(subjectId);
  }, [subjectId]);

  return (
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
      <div className="board">
        <div className="head">
          <h1>Subject ID</h1>
          <h1>Title</h1>
          <h1>Description</h1>
          <h1>Due Date</h1>
          <div className="empty"></div>
        </div>
        <div className="assignment">
          {news.map((update, index) => (
            <div key={index}>
              <span>{update?.subjectId}</span>
              <span>{update?.title}</span>
              <span>{update?.value}</span>
              {console.log(checkPassDueDate(update?.dueDate.toDate()), "DATE")}
              {update?.dueDate && (
                <span>{formatDate(update?.dueDate.toDate())}</span>
              )}
              <button
                className="btn btn-link btn-outline-primary text-decoration-none"
                onClick={() => toAssgDetails(update)}
              >
                Readmore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default SubjectDashboard;
