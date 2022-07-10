import React, { useState, useEffect } from "react";
import { storage, getNewsbyId, auth, db } from "./firebase";
import { useLocation } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { formatDate, checkPassDueDate } from "./utils/DateHelper";
import "./AssgDetails.css";

//a custom hook that builds on useLocation to parse
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ExamDetails() {
  const [progress, setProgress] = useState(0);
  const [exam, setExam] = useState();
  const [user] = useAuthState(auth);
  const [score, setScore] = useState();
  const { state } = useLocation();
  const { name } = state;
  let query = useQuery();
  const examId = query.get("id");
  const formHandler = (e, dueDate) => {
    e.preventDefault();
    if (checkPassDueDate(dueDate.toDate())) return;
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadAnswertoDb = async (downloadURL) => {
    await setDoc(doc(db, "exams", examId, "submission", user?.uid), {
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

  const fetchExam = async () => {
    try {
      const doc = await getExambyId(examId);
      setExam(doc.docs[0].data());
    } catch (err) {
      console.error(err);
      alert("error while load news");
    }
  };

  useEffect(() => {
    if (!examId) return;
    fetchExam();
  }, []);

  useEffect(() => {
    const asyncSetScore = async () => {
      const docref = await getDoc(
        doc(db, `exam/${examId}/submission/${user?.uid}`)
      );
      setScore(docref.docs[0].data());
    };
    if (user?.uid) {
      asyncSetScore();
    }
  }, [user]);

  if (!exam) return <></>;

  return (
    <div className="page">
      <div className="assgdetails-card">
        <div className="detailbox">
          <h1 className="assgdetails-title">{exam.subjectId} </h1>
          <h2>{exam.title} </h2>
          <h3>{exam.value} </h3>
          <p>Due date: {formatDate(exam.dueDate.toDate())}</p>
          <a href={exam.fileName} download>
            Click to download
          </a>
        </div>
        <form onSubmit={(e) => formHandler(e, exam.dueDate)}>
          <input type="file" className="input" />
          <button
            disabled={!checkPassDueDate(exam.dueDate.toDate())}
            type="submit"
          >
            Upload
          </button>
        </form>
        <hr />
        <h3> Uploaded {progress}% </h3>
        <h1>{score}</h1>
      </div>
    </div>
  );
}

export default ExamDetails;
