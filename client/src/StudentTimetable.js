import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Timetable from "react-timetable-events";

function StudentTimetable({ grade, major }) {
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    const asyncSetTimetable = async () => {
      const docref = await getDoc(doc(db, `timetables/${grade}-${major}`));
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
    if (!grade && !major) return;

    asyncSetTimetable();
  }, [grade, major]);

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
  );
}

export default StudentTimetable;
