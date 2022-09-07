import React, { useState, useEffect } from "react";
import Timetable from "react-timetable-events";
import TimePicker from "react-time-picker";
import Navbar from "./Navbar/Navbar";
import "./TeacherTimetable.css";
import { useParams } from "react-router-dom";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";

function TeacherTimetable() {
  const { grade, subject } = useParams();
  const [timetable, setTimetable] = useState({});
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [idToDelete, setIdToDelete] = useState("");

  const [role, setRole] = useState("");
  const [user] = useAuthState(auth);
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setRole(data.role);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    fetchUserName();
  }, [user]);

  useEffect(() => {
    const asyncSetTimetable = async () => {
      const docref = await getDoc(doc(db, `timetables/${grade}-${subject}`));
      if (!docref.data()) return;
      const formattedDocRefData = docref.data().events;
      for (const item in formattedDocRefData) {
        formattedDocRefData[item].map((ev) => {
          ev.startTime = ev.startTime.toDate();
          ev.endTime = ev.endTime.toDate();
        });
      }

      setTimetable(formattedDocRefData);
    };

    asyncSetTimetable();
  }, []);

  const setTimetableToDB = async () => {
    await setDoc(doc(db, "timetables", `${grade}-${subject}`), {
      events: timetable,
    });
  };

  const submitEvent = () => {
    let newTimetable = timetable;
    let newEventId = true;
    const newObj = {};
    newObj.id = id;
    newObj.name = `${id} - ${name}`;
    newObj.type = "custom";
    newObj.startTime = new Date(`2022-02-02T${startTime}:00`);
    newObj.endTime = new Date(`2022-02-02T${endTime}:00`);

    if (!newTimetable[day]) {
      newTimetable[day] = [];
    }

    newTimetable[day] = newTimetable[day].map((selectedObj) => {
      if (selectedObj.id === id) {
        newEventId = false;
        return newObj;
      } else {
        return selectedObj;
      }
    });

    if (newEventId === true) {
      newTimetable[day].push(newObj);
    }

    setTimetableToDB();
    setTimetable({ ...newTimetable });
  };

  const deleteEvent = () => {
    for (const item in timetable) {
      timetable[item] = timetable[item].filter((ev) => ev.id !== idToDelete);
    }
    setTimetableToDB();
    setTimetable({ ...timetable });
  };

  const sortedTimetable = () => {
    const sorter = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };

    let tmp = [];
    Object.keys(timetable).forEach(function (key) {
      let value = timetable[key];
      let index = sorter[key.toLowerCase()];
      tmp[index] = {
        key: key,
        value: value,
      };
    });

    let orderedData = {};
    tmp.forEach(function (obj) {
      orderedData[obj.key] = obj.value;
    });

    return orderedData;
  };

  return (
    <>
      <Navbar />
      {role === "admin" && (
        <div className="admin-card-timetable">
          <div className="container-timetable ">
            <input
              type="text"
              className="Title__textBox  "
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter event id"
            />
            <input
              type="text"
              className="Value__textBox  "
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter event name"
            />
            <select
              required
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">Select day</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
            </select>
          </div>

          <div className="container-timetable2">
            <TimePicker
              disableClock={true}
              onChange={(newValue) => setStartTime(newValue)}
              value={startTime}
            />
            <TimePicker
              disableClock={true}
              onChange={(newValue) => setEndTime(newValue)}
              value={endTime}
            />
          </div>

          <div className="container-timetable3">
            <button className="btn marbot" onClick={submitEvent}>
              Add/Edit Event
            </button>

            <div>
              <input
                type="text"
                className="Title__textBox  "
                value={idToDelete}
                onChange={(e) => setIdToDelete(e.target.value)}
                placeholder="Enter id to delete"
              />
              <button className="btn marleft" onClick={deleteEvent}>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "121.1rem",
          margin: "0 auto",
        }}
      >
        {Object.keys(timetable).length > 0 ? (
          <Timetable
            events={sortedTimetable()}
            style={{ height: "500px", width: "100%" }}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default TeacherTimetable;
