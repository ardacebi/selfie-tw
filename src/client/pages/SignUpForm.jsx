import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import postAccountData from "../data_creation/postAccountData.js";

const SignUpForm = () => {
  const [createAccountData, setCreateAccountData] = useState({
    username: "",
    password: "",
  });
  const results = useQuery(["sign_up", createAccountData], postAccountData);
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
          setCreateAccountData(userDataObj);
        }}
      >
        <h1>Sign Up</h1>
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
        <button type="submit">Login</button>

        <Link to="/login">Already have an account?</Link>
      </form>
    </div>
  );
};

export default SignUpForm;
