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
  const [grade, setGrade] = useState("");
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

      <div class="board-container">
        <div className="board-left">
          <h1>To Do List</h1>
          <div className="assignments">
            {news
              .filter((update) => checkPassDueDate(update?.dueDate.toDate()))
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

        <div class="board-right">
          <h1>Subjects</h1>
          <div class="subjects">
            {subjects.map((subject) => (
              <Link
                className="col image-card"
                to={`/subject-dashboard?subject=${subject}`}
              >
                <div>
                  <div class="img-box">
                    <img
                      src={getSubjectImage(subject)}
                      className="card-img-top subject-image"
                      alt="..."
                    />
                  </div>
                  <div class="card-body">
                    <h2>{subject}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudentDashboard;
