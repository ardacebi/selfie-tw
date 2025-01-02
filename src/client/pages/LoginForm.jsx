import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import fetchLoginData from "../data_fetching/fetchLoginData.js";

const LoginForm = () => {
  const [requestLoginData, setRequestLoginData] = useState({
    username: "",
    password: "",
  });
  const mutateAccount = useMutation(fetchLoginData, {
    onSuccess: (data) => {
      console.log('Account found! Logged in! ', data);
    },
    onError: (error) => {
      console.error('Error finding account: ', error);
    },
  });
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
          mutateAccount.mutate(userDataObj);
        }}
      >
        <h1>Login</h1>
        <label htmlFor="username">
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
        </label>

        <label htmlFor="password">
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
        </label>
        <div className="remember-me-button">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
        </div>
        <button type="submit">Login</button>

        <Link to="/sign_up">Don't have an account?</Link>
        <Link to="/forgot-password">Forgot Password?</Link>
      </form>
    </div>
  );
};

export default LoginForm;
