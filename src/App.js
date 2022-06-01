import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";
import AssgDetails from "./AssgDetails";
import TeacherAssignmentDetails from "./TeacherAssignmentDetails";
import SubjectDashboard from "./SubjectDashboard";
import GradeList from "./GradeList";
import SubjectList from "./SubjectList";
import StudentList from "./StudentList";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
