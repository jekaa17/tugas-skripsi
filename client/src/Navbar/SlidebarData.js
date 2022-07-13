import React from "react";

import { SiBookstack, SiGitbook, SiShotcut } from "react-icons/si";
import * as AiIcons from "react-icons/ai";

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
    icon: <SiBookstack />,
    cName: "nav-text",
  },
  {
    title: "Timetable",
    path: "/timetable",
    icon: <SiBookstack />,
    cName: "nav-text",
  },
  {
    title: "Exam",
    path: "/exam-teacher",
    icon: <SiGitbook />,
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
    icon: <SiGitbook />,
    cName: "nav-text",
  },
  {
    title: "Exam Card",
    path: "/exam-card",
    icon: <SiShotcut />,
    cName: "nav-text",
  },
];
