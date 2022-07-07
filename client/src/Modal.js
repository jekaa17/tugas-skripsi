import React, { useState } from "react";

function Modal(props) {
  const [score, setScore] = useState();

  let modalStyle = {
    // bug, modal background transparent is not working (modal need to be located at outer div)
    display: "block",
    backgroundColor: "rgba(0,0,0,0.8)",
    fontSize: "15px",
    textTransform: "capitalize"
  };

  let modalContentStyle = {
    backgroundColor: "#FFFFFF",
  };

  let closeBtn = {
    color: "#FFFFFF",
    opacity: 1,
  };

  let subtitle = {
    width: "80px",
    margin: "0",
    display: "inline-block"
  }

  let modalContentFooter = {
    display: "inline-block"
  }

  let submitBtn = {
    backgroundColor: "lightgrey",
    width: "100px",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    fontWeight: "500",
    marginTop: "10px"
  }

  return (
    <div className="modal show fade" style={modalStyle}>
      <div className="modal-dialog">
        <div className="modal-content" style={modalContentStyle}>
          <div className="modal-header">
            <h2 className="modal-title">Add Score</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={props.onClose}
            ></button>
          </div>
          <div className="d-flex flex-column justify-content-center modal-body">
            <h4>{props.grade}{" "}{props.subjectId}</h4>
            <div><span style={subtitle}>Name</span>:<span style={{margin: "0", marginLeft: "7px"}}>{props.studentName}</span></div>
            <div><span style={subtitle}>Student Id</span>:<span style={{margin: "0", marginLeft: "7px"}}>{props.studentId}</span></div>
            <div style={modalContentFooter}>
              <div className="d-flex">
              <div style={{marginTop: "20px"}} className="d-flex flex-column">
                Enter your score: 
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>
              </div>
              <button style={submitBtn} onClick={() => props.addScore(props.studentId, score)}>
                Submit
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={props.onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
