import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarTeacherData = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Student List",
    path: "/student-list",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Exam",
    path: "/exam-teacher",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
];

export const SidebarStudentData = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Exam",
    path: "/exam-student",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
  {
    title: "Exam Card",
    path: "/exam-card",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
];
