import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, getNews, getSubjects} from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";


function StudentDashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [subjects,setSubjects] = useState([]);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const fetchUserDetails = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setSubjects(data.subjects);
      console.log(data.subjects);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchNews = async () => {
    try{
      const grabNews = async(subject) =>{
        const doc = await getNews(subject)
        return doc.docs.map(doc =>doc.data());
      }
      const getData = async() =>{
        return Promise.all(subjects.map(subject=> grabNews(subject)))
      }
        getData().then(updates =>{ 
         (updates.map(update => update.map(singleUpdate => 
          setNews(news => [...news, singleUpdate]))));
        
      })
    } catch (err){
      console.error(err);
     alert("error while load news")
    }
  }
 
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserDetails();
  }, [user, loading]);

  useEffect(() =>{
    if(!subjects) 
    return;
    fetchNews();
  },[subjects]);

  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as student
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
         {news.map((update,index)=> 
         <div key={index} > 
           <span>{ update.subjectId}</span>
           <span>{ update.title}</span>
           <span>{ update.value}</span>
         </div>)}
       </div>
     </div>
  );
}
export default StudentDashboard;