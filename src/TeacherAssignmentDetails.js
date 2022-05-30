import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { storage, getNewsbyId } from "./firebase";
import { useLocation } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

//a custom hook that builds on useLocation to parse
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function TeacherAssignmentDetails() {
  const [progress, setProgress] = useState(0);
  const [news, setNews] = useState();
  const [assignments, setAssignments] = useState([]);
  const [modal, setModal] = useState(false);

  let query = useQuery();
  const assignmentId = query.get("id");
  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
    updateFileName(file);
  };

  async function updateFileName(file) {
    if (!file) return;
    const docRef = doc(db, "news", query.get("id"));

    await updateDoc(docRef, {
      fileName: `/files/${file.name}`,
    });
  }

  const uploadFiles = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      async () => {
        const docRef = doc(db, "news", query.get("id"));
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        await updateDoc(docRef, {
          fileName: downloadUrl,
        });
      }
    );
  };

  const addScore = async (userId, score) => {
    await updateDoc(doc(db, "news", assignmentId, "submission", userId), {
      score: score,
    });
  };

  const fetchNews = async () => {
    try {
      const doc = await getNewsbyId(assignmentId);
      setNews(doc.docs[0].data());
    } catch (err) {
      console.error(err);
      alert("error while load news");
    }
  };
  useEffect(async () => {
    if (!assignmentId) return;
    fetchNews();
    const docsSnap = await getDocs(
      collection(db, `news/${assignmentId}/submission`)
    );
    docsSnap.forEach((doc) => {
      setAssignments((assignments) => [...assignments, doc.data()]);
    });
  }, []);

  if (!news) return <></>;

  return (
    <div class="page">
      <div class="assgdetails-card">
        
        <div class="detailbox">
          <h1>{news.Title} </h1>
          <h2>{news.subjectId} </h2>
          <p>{news.value} </p>
        </div>

        <form onSubmit={formHandler}>
          <input type="file" className="input" />
          <button type="submit">Upload</button>
        </form>

        <hr />
        <h3> Uploaded {progress}% </h3>

        {assignments.map((assg, index) => (
          <div key={index}>
            <a href={assg.downloadUrl} download>
              Click to download
            </a>
            {/* <div>{assg.studentId}{' '}</div> */}
            <div>{assg.name}</div>
            <button onClick={() => setModal(true)}>add score</button>

            {modal === true ? (
              <Modal
                onClose={() => setModal(false)}
                addScore={addScore}
                studentId={assg.studentId}
                studentName={assg.name}
              />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherAssignmentDetails;
