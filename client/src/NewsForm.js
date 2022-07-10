import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { createNews, createExam } from "./firebase";
import "react-datepicker/dist/react-datepicker.css";

function NewsForm(props) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [grade, setGrade] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return (
    <div className="admin-register admin-card">
      <h1>Add New {capitalize(props.type)}</h1>
      <div className="admin-flex f">
        <input
          type="text"
          className="Title__textBox  "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          className="Value__textBox  "
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={capitalize(props.type)}
        />

        <DatePicker
          selected={dueDate}
          placeholderText="Due Date"
          onChange={(date) => setDueDate(date)}
        />

        <select
          required
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="grade__textBox"
          placeholder="Grade"
        >
          <option value="">Choose Grade</option>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>

        <select
          required
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="subject__textBox  "
          placeholder="Subject ID"
        >
          <option value="">Choose Subject</option>
          <option value="Bahasa Indonesia">Bahasa Indonesia</option>
          <option value="Mat">Mat</option>
          <option value="IPA">IPA</option>
          <option value="IPS">IPS</option>
        </select>
      </div>
      <button
        onClick={() => {
          if (props.type === "assignment")
            createNews(title, value, grade, subjectId, dueDate, props.userId);
          if (props.type === "exam")
            createExam(title, value, grade, subjectId, dueDate, props.userId);
          props.updateDocument();
        }}
        type="submit"
        className="news_btn "
      >
        Add {capitalize(props.type)}
      </button>
    </div>
  );
}

export default NewsForm;
