import { NavLink, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useContext, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const BaseHomePage = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
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

  const btnBg = theme === 'dark' ? "#333" : "#fff";
  const btnColor = theme === 'dark' ? "#c0c0c0" : "#000";
  const txtColor = theme === 'dark' ? '#c0c0c0' : '#000';
  
  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={{...styles.form, backgroundColor: 'transparent'}}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NavLink
              style={({ isActive }) => ({
                ...styles.button,
                ...styles.button1,
                backgroundColor: theme === 'dark' ? (isActive ? "#444" : "#333") : (isActive ? "#e7e7e7" : "#fff"),
                color: btnColor,
              })}
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              style={({ isActive }) => ({
                ...styles.button,
                backgroundColor: theme === 'dark' ? (isActive ? "#444" : "#333") : (isActive ? "#e7e7e7" : "#fff"),
                color: btnColor,
              })}
              to="/sign_up"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <div style={{...styles.form, backgroundColor: 'transparent'}}>
        <p style={{ color: txtColor }}>Welcome to Selfie. You are now logged in.</p>
        <div style={{
          display: 'inline-block',
          border: '2px solid #dcdcdc',
          borderRadius: '10px',
          padding: '5px 10px',
          marginTop: '10px',
          backgroundColor: btnBg,
        }}>
          <p style={{ 
            color: btnColor, 
            fontFamily: 'monospace',
            fontSize: '18px',
            margin: '0'
          }}>ID: {currentUser}</p>
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            backgroundColor: btnBg,
            color: btnColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          onClick={() => navigate("/calendar", { replace: true })}
        >
          <FaCalendarAlt style={{ fontSize: '32px', marginBottom: '8px' }} />
          Calendar
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    width: "100%",
  },
  form: {
    padding: "10px",
    display: "inline-block",
    marginTop: "100px",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: "10px",
    width: "100%",
  },
  button: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "auto",
    minWidth: "120px",
    padding: "10px 25px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s, border-color 0.3s, color 0.3s",
    textDecoration: "none",
  },
  button1: {
    marginRight: "5px",
  },
};

export default BaseHomePage;
