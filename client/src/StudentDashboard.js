import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, logout, getNews } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { formatDate, checkPassDueDate } from "./utils/DateHelper";
import Navbar from "./Navbar/Navbar";

function StudentDashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [news, setNews] = useState([]);
  const [grade, setGrade] = useState("");
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
      setSubjects(data.subjects);
      setGrade(data.grade);
      setMajor(data.major);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchNews = async () => {
    try {
      const grabNews = async (subject, grade) => {
        const doc = await getNews(subject, grade);
        return doc.docs.map((doc) => doc.data());
      };
      const getData = async () => {
        return Promise.all(subjects.map((subject) => grabNews(subject, grade)));
      };
      getData().then((updates) => {
        updates.map((update) =>
          update.map((singleUpdate) =>
            setNews((news) => [...news, singleUpdate])
          )
        );
      });
    } catch (err) {
      console.error(err);
      alert("error while load news");
    }
  };

  const getSubjectImage = (subject) => {
    if (subject === "IPA") return "./images/IPA.svg";
    if (subject === "IPS") return "./images/IPS.svg";
    if (subject === "Bahasa Indonesia") return "./images/BI.svg";
    if (subject === "Mat") return "./images/mate.svg";
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserDetails();
  }, [user, loading]);

  useEffect(() => {
    if (!subjects) return;
    if (!grade) return;
    fetchNews();
  }, [subjects, grade]);

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

        <div className="board-container">
          <div className="board-left">
            <h1>To Do List</h1>
            <div className="assignments">
              {news
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
                      onClick={() => toAssgDetails(update)}
                    >
                      Read More
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="board-right">
            <h1>Subjects</h1>
            <div className="subjects">
              {subjects.map((subject) => (
                <Link
                  className="col image-card"
                  to={`/subject-dashboard?subject=${subject}`}
                >
                  <div>
                    <div className="img-box">
                      <img
                        src={getSubjectImage(subject)}
                        className="card-img-top subject-image"
                        alt="..."
                      />
                    </div>
                    <div className="card-body">
                      <h2>{subject}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default StudentDashboard;
