import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const allSubjects = ["IPA", "IPS"];
function SubjectList() {
  const { grade } = useParams();
  return (
    <div className="row">
      {allSubjects.map((subject) => (
        <Link
          className="col image-card"
          to={`/student-list/${grade}/${subject}`}
        >
          <div>
            <div class="img-box">
              <img src="" className="card-img-top subject-image" alt="..." />
            </div>
            <div class="card-body">
              <h2>{subject}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SubjectList;
