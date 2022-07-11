import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
// import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth, logInWithEmailAndPassword } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // const auth = getAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  // const resetPassword = () => {
  //   sendPasswordResetEmail(auth, email)
  //   .then(() => {
  //     // Password reset email sent!
  //     // ..
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // ..
  //   });
  // }

  if (loading) {
    return <p>loading ...</p>;
  }

  return (
    <div className="page">
      <div className="sign-in">
        <h1>Sign In</h1>

        <div className="fill">
          <div className="image">
            <img src="./images/pscn.png" alt="teacher" />
          </div>
          <div className="details">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="login__textBox p-2 m-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
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
            {/* <button onClick={resetPassword}>
              Reset password
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
