import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import "./ExamCard.css";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "./Navbar/Navbar";

function ExamCard() {
  const [user, loading, error] = useAuthState(auth);
  const [studentDetails, setStudentDetails] = useState();
  const fetchUserDetails = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setStudentDetails(data);
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return Navigate("/");
    fetchUserDetails();
  }, [user, loading]);
  if (!studentDetails) return <></>;

  if (!studentDetails.finance)
    return (
      <>
        <Navbar />
        <div class="finance-error-container">
          <div class="finance-error">
            <a href="">
              <img
                class="temp-img"
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
    <div class="exam_card_page">
      <div class="exam_card">
        <div class="exam_card_details">
          <h1>{studentDetails.name}</h1>
          <h2>{studentDetails.email}</h2>
          <h3>{studentDetails.nis}</h3>
          <h3>
            {studentDetails.grade} - {studentDetails.major}
          </h3>
          <h3>Finance: {studentDetails.finance ? "COMPLETED" : "PENDING"}</h3>
          <div>
            {studentDetails.subjects.map((subject) => (
              <div key={subject}>{subject}</div>
            ))}
          </div>
        </div>
        <div class="exam_card_icon">
          <a href="">
            <img
              class="temp-img"
              src="./images/square-check-solid.svg"
              alt="alert"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ExamCard;
