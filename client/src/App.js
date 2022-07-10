import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";
import AssgDetails from "./AssgDetails";
import TeacherAssignmentDetails from "./TeacherAssignmentDetails";
import SubjectDashboard from "./SubjectDashboard";
import GradeList from "./GradeList";
import SubjectList from "./SubjectList";
import ExamTeacherDashboard from "./ExamTeacherDashboard";
import StudentList from "./StudentList";
import TeacherExamDetails from "./TeacherExamDetails";
import ExamStudentDashboard from "./ExamStudentDashboard";
import ExamStudentDetails from "./ExamStudentDetails";
import ExamCard from "./ExamCard";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/assignment" element={<AssgDetails />} />
          <Route
            exact
            path="/teacher/assignment"
            element={<TeacherAssignmentDetails />}
          />
          <Route path="/subject-dashboard" element={<SubjectDashboard />} />
          <Route exact path="/student-list" element={<GradeList />}></Route>
          <Route
            exact
            path="/student-list/:grade"
            element={<SubjectList />}
          ></Route>
          <Route
            exact
            path="/student-list/:grade/:subject"
            element={<StudentList />}
          ></Route>
          <Route
            exact
            path="/exam-teacher"
            element={<ExamTeacherDashboard />}
          ></Route>
          <Route
            exact
            path="/exam-teacher/details"
            element={<TeacherExamDetails />}
          />
          <Route
            exact
            path="/exam-student"
            element={<ExamStudentDashboard />}
          />
          <Route
            exact
            path="/exam-student/details"
            element={<ExamStudentDetails />}
          />
          <Route exact path="/exam-card" element={<ExamCard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
