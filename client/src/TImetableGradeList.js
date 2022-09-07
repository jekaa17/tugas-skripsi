import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GradeList.css";
import Navbar from "./Navbar/Navbar";

const allGrades = [
  { number: "X", img: "/images/x.png" },
  { number: "XI", img: "/images/xi.png" },
  { number: "XII", img: "/images/xii.png" },
];
function TimetableGradeList() {
  return (
    <>
      <Navbar />
      <div className="rows">
        {allGrades.map((grade) => (
          <Link
            key={grade.number}
            className="col image-card"
            to={`/timetable/${grade.number}`}
          >
            <div>
              <img
                src={grade.img}
                className="card-img-top subject-image"
                alt="..."
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default TimetableGradeList;
