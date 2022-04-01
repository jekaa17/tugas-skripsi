import React, {  useState } from "react";
import { createNews } from "./firebase";


function NewsForm(){
  
  const[title, setTitle ]=useState("");
  const[value, setValue ]=useState("");
  const[subjectId,setSubjectId]=useState("");

    return (
        <div className="news h-100">
          <div className="news__container ">
              <input
               type="text"
               className="Title__textBox p-5 "
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Title"
              />
              <input
                type="text"
                className="Value__textBox p-5 "
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="News"
              />
              <input
                type="text"
                className="subject__textBox p-5 "
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                placeholder="Subject ID"
              />
              <button 
              onClick = {() => createNews(title,value,subjectId)}
              type="submit"
              className="news_btn p-5 " 
              >
                Add News
              </button>
          </div>
        </div>
      );
}

export default NewsForm;