import React, {  useState } from "react";
import {
  registerWithEmailAndPassword,
} from "./firebase";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState('');
  const register = () => {
    if (!name) {
        alert("Please enter name");
        return;
    } 
    registerWithEmailAndPassword(name, email, password, subject);
  };

  const handleChange = (event) =>{
   setSubject(event.target.value)
  }

  return (
    <div className="register">
      <div className="register__container">
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
        <select required value={subject} onChange={handleChange}>
          <option value="">Select option</option>
          <option value="IPA">IPA</option>
          <option value="IPS">IPS</option>
        </select>
        <button className="register__btn" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}
export default Register;