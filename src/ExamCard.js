import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

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
      <div>
        There is outstanding invoice that has yet to pay. If it is mistaken,
        contact to your student centre by calling or emailing them
      </div>
    );
  return (
    <div>
      <h1>{studentDetails.name}</h1>
      <h1>{studentDetails.email}</h1>
      <h1>{studentDetails.nis}</h1>
      <h1>{studentDetails.grade}</h1>
      <h1>{studentDetails.major}</h1>
      <h2>Finance: {studentDetails.finance ? "COMPLETED" : "PENDING"}</h2>
      <div>
        {studentDetails.subjects.map((subject) => (
          <div key={subject}>{subject}</div>
        ))}
      </div>
    </div>
  );
}

export default ExamCard;
