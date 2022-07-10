import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc} from "firebase/firestore";
import Timetable from "react-timetable-events";
import TimePicker from 'react-time-picker';

function StudentTimetable() {
  const [timetable, setTimetable] = useState({});
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  useEffect(() => {

    const asyncSetTimetable = async () => {
      const docref = await getDoc(
        doc(db, `timetables/XII-IPA`)
      );

      console.log(new Date("2018-02-23T11:30:00"), 'notformatted')
      const formattedDocRefData = docref.data().events;
      for (const item in formattedDocRefData) {
        formattedDocRefData[item].map((ev) => {
          ev.startTime = ev.startTime.toDate();
          ev.endTime = ev.endTime.toDate();
        })
      }
      console.log(formattedDocRefData, 'formattedDocRefData')

      setTimetable(formattedDocRefData)
    };
    
      asyncSetTimetable();
  }, []);

  const setTimetableToDB = async () => {
    await setDoc(doc(db, "timetables", 'XII-IPA'), {
      events: timetable
    });
  };


  const submitEvent = () => {

      console.log(startTime, 'startTime');
      console.log(endTime, 'endTime');

      let newTimetable = timetable
      let newEventId = true;
      const newObj = {};
      newObj.id = id;
      newObj.name = `${id} - ${name}`;
      newObj.type = "custom";
      newObj.startTime = new Date(`2022-02-02T${startTime}:00`);
      newObj.endTime = new Date(`2022-02-02T${endTime}:00`);

      if (!newTimetable[day]) {
        newTimetable[day] = []
      }

      newTimetable[day] = newTimetable[day].map((selectedObj) => {
        if (selectedObj.id === id) {
          newEventId = false;
          console.log('edit')
          return newObj;
        } else {
          console.log('1')
          return selectedObj
        }
      })

      if (newEventId === true) {
        newTimetable[day].push(newObj)
        console.log('2')
      }

      setTimetableToDB();
      
      setTimetable({...newTimetable})

      console.log(newTimetable, 'newTimeTable');
  }
    
  
  if (Object.keys(timetable).length === 0)
    return<></>;
    
  return (
    <>
      <div>
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
          <select required value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">Select day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
          <TimePicker
            disableClock={true}
            onChange={(newValue)=>setStartTime(newValue)}
            value={startTime}
          />
          <TimePicker
            disableClock={true}
            onChange={(newValue)=>setEndTime(newValue)}
            value={endTime}
          />
          <button onClick={submitEvent}>submit</button>
      </div>
      <Timetable
      events={timetable}
        style={{ height: "500px", width: "80%" }}
      />
    </>
  );
}

export default StudentTimetable;
