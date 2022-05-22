import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, logout, getNews } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { formatDate, checkPassDueDate } from "./utils/DateHelper";

function StudentDashboard() {
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

  const fetchNews = async () => {
    try {
      const grabNews = async (subject) => {
        const doc = await getNews(subject);
        return doc.docs.map((doc) => doc.data());
      };
      const getData = async () => {
        return Promise.all(subjects.map((subject) => grabNews(subject)));
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
    if (subject === "IPA") return "./images/IPA.jpeg";
    if (subject === "IPS") return "./images/IPS.jpeg";
    if (subject === "Bahasa Indonesia") return "./images/BI.jpeg";
    if (subject === "Mat") return "./images/trigonometry.jpeg";
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserDetails();
  }, [user, loading]);

  useEffect(() => {
    if (!subjects) return;
    fetchNews();
  }, [subjects]);

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
      <div>
        <div class="row">
          {subjects.map((subject) => (
            <Link
              className="col image-card"
              to={`/subject-dashboard?subject=${subject}`}
            >
              <div>
                <img
                  src={getSubjectImage(subject)}
                  className="card-img-top subject-image"
                  alt="..."
                />
                <div class="card-body">
                  <h2>{subject}</h2>
                  <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="board">
        <div className="head">
          <h1>Subject ID</h1>
          <h1>Title</h1>
          <h1>Description</h1>
          <h1>Due Date</h1>
          <div className="empty"></div>
        </div>
        <div className="assignment">
          {news
            .filter((update) => checkPassDueDate(update?.dueDate.toDate()))
            .map((update, index) => (
              <div key={index}>
                <span>{update?.subjectId}</span>
                <span>{update?.title}</span>
                <span>{update?.value}</span>
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
                  Readmore
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default StudentDashboard;
