import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import postAccountData from "../data_creation/postAccountData.js";
import { ThemeContext } from "../contexts/ThemeContext.jsx";

const SignUpForm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      button:hover, a:hover {
        background-color: ${theme === 'dark' ? '#444444' : '#f0f0f0'} !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

  const inputBg = theme === 'dark' ? '#333' : '#fff';
  const inputColor = theme === 'dark' ? '#f8f7f5' : '#000';
  const linkColor = theme === 'dark' ? '#b0b0b0' : '#9A9A9A';

  const signup = useMutation(postAccountData, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: () => {
      setError("Success! You signed up!");
      document.querySelector("#error_text").style.color = "green";
      document.querySelector("#error_text").style.visibility = "visible";
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      setError(error.message);
      document.querySelector("#error_text").style.color = "red";
      document.querySelector("#error_text").style.visibility = "visible";
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          signup.mutate({
            email: formData.get("email") ?? "",
            username: formData.get("username") ?? "",
            password: formData.get("password") ?? "",
          });
        }}
      >
        <label htmlFor="email">
          <input
            style={{...styles.field, backgroundColor: inputBg, color: inputColor}}
            name="email"
            id="email"
            type="text"
            placeholder="Email"
            required
          />
          <br />
        </label>

        <label htmlFor="username">
          <input
            style={{...styles.field, backgroundColor: inputBg, color: inputColor}}
            name="username"
            id="username"
            type="text"
            placeholder="Username"
            required
          />
          <br />
        </label>

        <label htmlFor="password">
          <input
            style={{...styles.field, backgroundColor: inputBg, color: inputColor}}
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            required
          />
          <br />
        </label>

        <button 
          type="submit" 
          style={{...styles.button, backgroundColor: inputBg, color: inputColor}}
        >
          Create Account
        </button>

        <NavLink 
          style={{...styles.a_account, color: linkColor}} 
          to="/login"
        >
          Already have an account?
        </NavLink>
      </form>

      <p id="error_text" style={styles.error_text}>{error}</p>
    </div>
  );
};

const styles = {
  field: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "250px",
    padding: "10px 25px",
    fontSize: "16px",
    transition: "background-color 0.3s, color 0.3s",
  },
  button: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "300px",
    cursor: "pointer",
    padding: "10px 25px",
    fontSize: "16px",
    transition: "background-color 0.3s, color 0.3s",
  },
  a_account: {
    textDecoration: "none",
    display: "block",
    padding: "15px 0px",
  },
  error_text: {
    color: "gray",
    fontSize: "18px",
    visibility: "hidden",
    textAlign: "center",
  },
};

export default SignUpForm;
