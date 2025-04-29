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
      
      input:focus {
        outline: none !important;
        box-shadow: 0 0 0 2px ${theme === 'dark' ? '#555555' : '#e0e0e0'} !important;
        border-color: ${theme === 'dark' ? '#666666' : '#cccccc'} !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

  const inputBg = theme === 'dark' ? '#333' : '#fff';
  const inputColor = theme === 'dark' ? '#e0e0e0' : '#000';
  const titleColor = theme === 'dark' ? '#e0e0e0' : 'black';
  const borderColor = theme === 'dark' ? '#444444' : '#dcdcdc';

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
            style={{...styles.field, backgroundColor: inputBg, color: inputColor, borderColor: borderColor}}
            name="email"
            id="email"
            type="text"
            placeholder="Email"
            required
          />
          <br />
        </label>

        <div style={{marginBottom: '20px'}}></div>

        <label htmlFor="password">
          <input
            style={{...styles.field, backgroundColor: inputBg, color: inputColor, borderColor: borderColor}}
            name="password"
            id="password"
            type="password"
            placeholder="New Password"
            required
          />
          <br />
        </label>
        
        <div style={{marginBottom: '20px'}}></div>
        
        <button 
          type="submit" 
          style={{...styles.button, backgroundColor: inputBg, color: inputColor, borderColor: borderColor}}
        >
          Change Password
        </button>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: theme === 'dark' ? '#444' : '#f8f8f8',
        border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'flex-start',
        maxWidth: '300px',
      }}>
        <div style={{ 
          marginRight: '10px',
          backgroundColor: theme === 'dark' ? '#666' : '#e0e0e0',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          color: theme === 'dark' ? '#fff' : '#444',
          flexShrink: 0,
        }}>
          i
        </div>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: theme === 'dark' ? '#ccc' : '#666',
          lineHeight: '1.4'
        }}>
          In production environments, password changes require email verification for security. This is not the case in this educational project. Without this verification, any user could change another user's password, which is not expected practice.
        </p>
      </div>

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
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
  },
  button: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "300px",
    cursor: "pointer",
    padding: "10px 25px",
    fontSize: "16px",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
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
