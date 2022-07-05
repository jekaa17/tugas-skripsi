import React, { useState } from "react";

function Modal(props) {
  const [score, setScore] = useState();

  let modalStyle = {
    // bug, modal background transparent is not working (modal need to be located at outer div)
    display: "block",
    backgroundColor: "#FFFFFF",
  };

  let modalContentStyle = {
    backgroundColor: "#FFFFFF",
  };

  let closeBtn = {
    color: "#FFFFFF",
    opacity: 1,
  };

  return (
    <div className="modal show fade" style={modalStyle}>
      <div className="modal-dialog">
        <div className="modal-content" style={modalContentStyle}>
          <div className="modal-header">
            <h5 className="modal-title">Score</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={props.onClose}
            ></button>
          </div>
          <div className="d-flex flex-column justify-content-center modal-body">
            <div>{props.studentName}</div>
            <div>{props.studentId}</div>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
            <button onClick={() => props.addScore(props.studentId, score)}>
              submit
            </button>
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
