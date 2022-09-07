import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0]?.data();
      if (!data) return;
      const role = data.role;
      if (role === "admin") {
        setRole("admin");
      } else if (role === "teacher") {
        setRole("teacher");
      } else {
        setRole("student");
      }
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user) fetchUserName();
  }, [user]);

  if (role === "student") return <StudentDashboard />;
  if (role === "admin" || role === "teacher")
    return <AdminDashboard userId={user?.uid} />;

  return <p> loading ... </p>;
}
export default Dashboard;
