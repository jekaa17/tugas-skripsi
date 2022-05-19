import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { auth, logInWithEmailAndPassword } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      return <p>loading ...</p>;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div class="page">
      <div class="sign-in">
        <h1>Sign In</h1>

        <div class="fill">
          <div class="image">
            <img
              src="./images/undraw_professor_re_mj1s (1).svg"
              alt="teacher"
            />
          </div>
          <div class="details">
            <label for="email">Email</label>
            <input
              type="text"
              className="login__textBox p-2 m-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label for="password">Password</label>
            <input
              type="password"
              className="login__textBox p-2 m-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              // className="btn btn-primary p-2 m-2"
              onClick={() => logInWithEmailAndPassword(email, password)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
