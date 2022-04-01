import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import './App.css';

function App() {
  return (
    <div className="app">
     <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard/" element={<Dashboard />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
