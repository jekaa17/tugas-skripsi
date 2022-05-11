import React, { useState, useEffect } from "react";
import { storage, getNewsbyId, auth, db } from "./firebase";
import { useLocation } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";

//a custom hook that builds on useLocation to parse
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function AssgDetails() {
  const [progress, setProgress] = useState(0);
  const [news, setNews] = useState();
  const [user] = useAuthState(auth);
  const [score, setScore] = useState();
  const { state } = useLocation();
  const { name } = state;
  let query = useQuery();
  const assignmentId = query.get("id");
  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadAnswertoDb = async (downloadURL) => {
    await setDoc(doc(db, "news", assignmentId, "submission", user?.uid), {
      studentId: user?.uid,
      downloadUrl: downloadURL,
      name: name,
    });
  };

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
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        uploadAnswertoDb(downloadUrl);
      }
    );
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
  }, []);

  useEffect(async () => {
    console.log("run");
    if (user?.uid) {
      console.log(user.uid);
      console.log(assignmentId);
      console.log(`news/${assignmentId}/submission/${user?.uid}`);
      // get score
      const docref = await getDocs(
        doc(db, `news/${assignmentId}/submission/${user?.uid}`)
      );
      setScore(docref.docs[0].data());
    }
  }, [user]);

  if (!news) return <></>;

  return (
    <div>
      <div>
        <h1>{news.Title} </h1>
        <h2>{news.subjectId} </h2>
        <p>{news.value} </p>
        <a href={news.fileName} download>
          Click to download
        </a>
      </div>
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <h3> Uploaded {progress}% </h3>
      <h1>{score}</h1>
    </div>
  );
}

export default AssgDetails;
