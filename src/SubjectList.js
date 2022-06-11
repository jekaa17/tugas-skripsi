import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

const allSubjects = [
  { name: "IPA", img: "/images/IPA.svg" },
  { name: "IPS", img: "/images/IPA.svg" },
];
function SubjectList() {
  const { grade } = useParams();
  return (
    <>
      <Navbar role="admin" />
      <div className="row">
        {allSubjects.map((subject) => (
          <Link
            className="col image-card"
            to={`/student-list/${grade}/${subject.name}`}
          >
            <div>
              <div class="img-box">
                <img
                  src={subject.img}
                  className="card-img-top subject-image"
                  alt="..."
                />
              </div>
              <div class="card-body">
                <h2>{subject.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default SubjectList;
