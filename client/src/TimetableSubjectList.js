import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

const allSubjects = [
  { name: "IPA", img: "/images/IPA.svg" },
  { name: "IPS", img: "/images/IPS.svg" },
];
function TimetableSubjectList() {
  const { grade } = useParams();
  return (
    <>
      <Navbar />
      <div className="rows">
        {allSubjects.map((subject) => (
          <Link
            key={subject.name}
            className="col image-card"
            to={`/timetable/${grade}/${subject.name}`}
          >
            <div>
              <div className="img-box">
                <img
                  src={subject.img}
                  className="card-img-top subject-image"
                  alt="..."
                />
              </div>
              <div className="card-body">
                <h2>{subject.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default TimetableSubjectList;
