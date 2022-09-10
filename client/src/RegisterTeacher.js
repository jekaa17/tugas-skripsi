import React, { useState } from "react";
import { registerTeacherWithEmailAndPassword } from "./firebase";
import "./RegisterTeacher.css";

function RegisterTeacher() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const register = () => {
    if (!name) {
      alert("Please enter name");
      return;
    }
    registerTeacherWithEmailAndPassword(name, email, password);
  };

  return (
    <div className="admin-register admin-card">
      <h1>Register New Teacher</h1>
      <div className="admin-flex-center">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <button className="register__btn" onClick={register}>
        Register
      </button>
    </div>
  );
}
export default RegisterTeacher;
