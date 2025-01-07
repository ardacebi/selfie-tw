import { NavLink } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

const BaseHomePage = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  if (!currentUser){
    return (
      <header style={styles.header}>
        <div style={styles.form}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NavLink
              style={({ isActive }) => ({
                ...styles.button,
                ...styles.button1,
                backgroundColor: isActive ? "#e7e7e7" : "#fff",
                color: "#000",
              })}
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              style={({ isActive }) => ({
                ...styles.button,
                backgroundColor: isActive ? "#e7e7e7" : "#fff",
                color: "#000",
              })}
              to="/sign_up"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </header>
    );
  }
  else {
    return(
      <header style={styles.header}>
        <div style={styles.form}>
          <p>YOU ARE CONNECTED TO YOUR ACCOUNT! ID: {currentUser}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
        <button styles={styles.button}
        onClick={() => {
          setCurrentUser(null);
          localStorage.removeItem("savedUser");
        }}>
          Exit Account
        </button>
        </div>
      </header>
    )
    
  }
  
};

const styles = {
  header: {
    padding: "20px",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#f8f7f5",
    padding: "10px",
    display: "inline-block",
    marginTop: "200px",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#fff",
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "100px",
    padding: "10px 25px",
    fontSize: "16px",
    color: "#000",
    cursor: "pointer",
    transition: "background-color 0.3s, border-color 0.3s",
    textDecoration: "none",
  },
  button1: {
    marginRight: "5px",
  },
};

export default BaseHomePage;
