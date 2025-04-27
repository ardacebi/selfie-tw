import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import fetchLoginData from "../data_fetching/fetchLoginData.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import { ThemeContext } from "../contexts/ThemeContext.jsx";
import selfieImg from '../assets/selfie.png';

const LoginForm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setCurrentUser } = useContext(CurrentUserContext);
  
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
  const linkColor = theme === 'dark' ? '#b0b0b0' : '#9A9A9A';
  const borderColor = theme === 'dark' ? '#444444' : '#dcdcdc';
  
  const login = useMutation(fetchLoginData, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: (res) => {
      setError("Success! You logged in!");
      document.querySelector("#error_text").style.color = "green";
      document.querySelector("#error_text").style.visibility = "visible";
      setCurrentUser(res.data._id);
      if (rememberMe) localStorage.setItem("savedUser", res.data._id);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      setError(error.message);
      document.querySelector("#error_text").style.color = "red";
      document.querySelector("#error_text").style.visibility = "visible";
    },
  });
  
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src={selfieImg} alt="Selfie" style={styles.logo} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          login.mutate({
            username: formData.get("username") ?? "",
            password: formData.get("password") ?? "",
          });
        }}
      >
        <label htmlFor="username">
          <input
            style={{...styles.field, backgroundColor: inputBg, color: inputColor, marginBottom: "15px", borderColor: borderColor}}
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
            style={{...styles.field, backgroundColor: inputBg, color: inputColor, marginBottom: "15px", borderColor: borderColor}}
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            required
          />
          <br />
        </label>
        
        <div className="remember-me-button">
          <label style={{ color: linkColor }}>
            <input
              type="checkbox"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <br />
        
        <button 
          type="submit" 
          style={{...styles.button, backgroundColor: inputBg, color: inputColor, borderColor: borderColor}}
        >
          Log In
        </button>
        <br /><br />

        <NavLink style={{...styles.forgot, color: linkColor}} to="/forgot_password">
          Forgot your password?
        </NavLink>

        <NavLink style={{...styles.a_account, color: linkColor}} to="/sign_up">
          Don't have an account? Sign up.
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
  forgot: { textDecoration: "none" },
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
  logo: {
    maxWidth: "150px",
    height: "auto",
    marginBottom: "20px",
    borderRadius: "10px",
  },
};

export default LoginForm;
