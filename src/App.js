import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import './App.css';
import AssgDetails from "./AssgDetails";
import TeacherAssignmentDetails from "./TeacherAssignmentDetails";

function App() {
  return (
    <div className="app">
     <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />}/>
          <Route exact path="/assignment" element={<AssgDetails />}/>
          <Route exact path="/teacher/assignment" element={<TeacherAssignmentDetails />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
