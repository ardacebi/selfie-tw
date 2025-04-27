import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import postNewPassword from "../data_creation/postNewPassword.js";
import { ThemeContext } from "../contexts/ThemeContext.jsx";

const ForgotPasswordForm = () => {
  const { theme } = useContext(ThemeContext);
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
  const inputColor = theme === 'dark' ? '#c0c0c0' : '#000';
  const titleColor = theme === 'dark' ? '#c0c0c0' : 'black';

  const resetPassword = useMutation(postNewPassword, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: () => {
      setError("Success! The password has been changed!");
      document.querySelector("#error_text").style.color = "green";
      document.querySelector("#error_text").style.visibility = "visible";
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
          resetPassword.mutate({
            email: formData.get("email") ?? "",
            password: formData.get("password") ?? "",
          });
        }}
      >
        <h1 style={{...styles.title, color: titleColor}}>Forgot Password</h1>
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

        <label htmlFor="password">
          <input
            style={{...styles.field, backgroundColor: inputBg, color: inputColor}}
            name="password"
            id="password"
            type="password"
            placeholder="New Password"
            required
          />
          <br />
        </label>
        
        <button 
          type="submit" 
          style={{...styles.button, backgroundColor: inputBg, color: inputColor}}
        >
          Change Password
        </button>
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
  title: {
    textAlign: "center",
  },
  error_text: {
    color: "gray",
    fontSize: "18px",
    visibility: "hidden",
    textAlign: "center",
  },
};

export default ForgotPasswordForm;
