import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      return <p>
          loading ...
      </p>;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className=" d-flex justify-content-center align-items-center h-100 ">
      <div className="login__container d-flex flex-column ">
        <input
          type="text"
          className="login__textBox p-2 m-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox p-2 m-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="btn btn-primary p-2 m-2"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
      </div>
    </div>
  );
}
export default Login;