import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GradeList.css";
import Navbar from "./Navbar/Navbar";

const allGrades = [
  { number: "X", img: "/images/IPA.svg" },
  { number: "XI", img: "/images/IPA.svg" },
  { number: "XII", img: "/images/IPA.svg" },
];
function GradeList() {
  return (
    <>
      <Navbar role="admin" />
      <div className="rows">
        {allGrades.map((grade) => (
          <Link className="col image-card" to={`/student-list/${grade.number}`}>
            <div>
              <img
                src={grade.img}
                className="card-img-top subject-image"
                alt="..."
              />
              <div class="card-body">
                <h2>{grade.number}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default GradeList;
