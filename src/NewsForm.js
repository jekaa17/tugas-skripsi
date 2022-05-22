import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { createNews } from "./firebase";
import "react-datepicker/dist/react-datepicker.css";

function NewsForm(props) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  return (
    <div className="news h-100">
      <div className="news__container ">
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
          placeholder="Assignment"
        />
        <select
          required
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="subject__textBox  "
          placeholder="Subject ID"
        >
          <option value="">Select option</option>
          <option value="Bahasa Indonesia">Bahasa Indonesia</option>
          <option value="Mat">Mat</option>
          <option value="IPA">IPA</option>
          <option value="IPS">IPS</option>
        </select>

        <DatePicker
          selected={dueDate}
          placeholderText="Due Date"
          onChange={(date) => setDueDate(date)}
        />

        <button
          onClick={() => {
            createNews(title, value, subjectId, dueDate, props.userId);
            props.updateAssignment();
          }}
          type="submit"
          className="news_btn "
        >
          Add Assignment
        </button>
      </div>
    </div>
  );
}

export default NewsForm;
