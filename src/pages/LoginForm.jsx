import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import fetchLoginData from "../data_fetching/fetchLoginData.js";

const LoginForm = () => {
  const [requestLoginData, setRequestLoginData] = useState({
    username: "",
    password: "",
  });
  const results = useQuery(["login", requestLoginData], fetchLoginData);
  return (
    <div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const userDataObj = {
            username: formData.get("username") ?? "",
            password: formData.get("password") ?? "",
          };
          setRequestLoginData(userDataObj);
        }}
      >
        <h1>Login</h1>
        <div className="input-box">
          <input
            name="username"
            id="username"
            type="text"
            placeholder="Username"
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-me-button">
          <label>
            <input type="checkbox" />
            Remember Me
            <Link to="/register">Don't have an account?</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
