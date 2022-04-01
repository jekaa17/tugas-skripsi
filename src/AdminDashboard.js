import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Register from "./Register";
import NewsForm from "./NewsForm";

function AdminDashboard() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  
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
  useEffect(() => {
    fetchUserName();
  }, [user]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as admin
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
      <Register />
      <NewsForm />
     </div>
  );
}
export default AdminDashboard;