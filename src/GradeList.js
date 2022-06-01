import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GradeList.css";

const allGrades = ["X", "XI", "XII"];
function GradeList() {
  return (
    <div className="row">
      {allGrades.map((grade) => (
        <Link className="col image-card" to={`/student-list/${grade}`}>
          <div>
            <div class="img-box">
              <img src="" className="card-img-top subject-image" alt="..." />
            </div>
            <div class="card-body">
              <h2>{grade}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default GradeList;
