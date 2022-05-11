import React, {  useState } from "react";
import { createNews } from "./firebase";


function NewsForm(props){
  
  const[title, setTitle ]=useState("");
  const[value, setValue ]=useState("");
  const[subjectId,setSubjectId]=useState("");

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
              <input
                type="text"
                className="subject__textBox  "
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                placeholder="Subject ID"
              />
              <button 
              onClick = {() =>{
                createNews(title,value,subjectId,props.userId)
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