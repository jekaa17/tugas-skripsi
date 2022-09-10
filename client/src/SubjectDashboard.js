import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./StudentDashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, logout, getNews } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { formatDate, checkPassDueDate } from "./utils/DateHelper";
import Navbar from "./Navbar/Navbar";

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
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [news, setNews] = useState([]);
  const [major, setMajor] = useState("");
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
      setGrade(data.grade);
      setMajor(data.major);
      setSubjects(data.subjects);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchNews = async (subjectId) => {
    try {
      const grabNews = async (subjectId) => {
        console.log(user);
        const doc = await getNews(subjectId, grade);
        console.log(doc.docs);
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
    if (!subjectId && !grade) return;
    fetchNews(subjectId);
  }, [grade, subjectId]);

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
              {news.map((update, index) => (
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
                    onClick={() => toAssgDetails(update)}
                  >
                    Readmore
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default SubjectDashboard;
