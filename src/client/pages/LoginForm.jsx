import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext } from "react";
import fetchLoginData from "../data_fetching/fetchLoginData.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";



const LoginForm = () => {
  let navigate = useNavigate();
  const [accountCreationError, setAccountCreationError] = useState("no error");
  const [rememberMe, setRememberMe] = useState(false);
  const { setCurrentUser, currentUser } = useContext(CurrentUserContext);

  const mutateAccount = useMutation(fetchLoginData, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: (res) => {
      console.log("Account found! Logged in! ", res);
      setAccountCreationError("Success! You logged in!");
      document.querySelector("#error_text").style.color = "green";
      document.querySelector("#error_text").style.visibility = "visible";
      setCurrentUser(res.data._id);
      if (rememberMe) {
        localStorage.setItem("savedUser", res.data._id);
      }
      navigate("/", { replace: true });
    },
    onError: (error) => {
      setAccountCreationError(error.message);
      document.querySelector("#error_text").style.color = "red";
      document.querySelector("#error_text").style.visibility = "visible";
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
        <label htmlFor="username">
          <div className="input-box">
            <input
              style={styles.field}
              name="username"
              id="username"
              type="text"
              placeholder="Username"
              required
            />
          </div>
          <br></br>
        </label>

        <label htmlFor="password">
          <div className="input-box">
            <input
              style={styles.field}
              name="password"
              id="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <br></br>
        </label>
        <div className="remember-me-button">
          <label style={{ color: "#9A9A9A" }}>
            <input
              type="checkbox"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <br></br>
        <button type="submit" style={styles.button}>
          Login
        </button>
        <br></br>
        <br></br>

        <NavLink style={styles.forgot} to="/forgot_password">
          Forgot your password?
        </NavLink>

        <NavLink style={styles.a_account} to="/sign_up">
          You do not have an account? Sign up here!
        </NavLink>
      </form>

      <div>
        <p id="error_text" style={styles.error_text}>
          {accountCreationError}
        </p>
      </div>
    </div>
  );
};

const styles = {
  field: {
    backgroundColor: "#fff",
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "250px",
    padding: "10px 25px",
    fontSize: "16px",
    color: "#000",
    transition: "background-color 0.3s, border-color 0.3s",
    textDecoration: "none",
  },

  button: {
    backgroundColor: "#fff",
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "300px",
    cursor: "pointer",
    padding: "10px 25px",
    fontSize: "16px",
    color: "#000",
    transition: "background-color 0.3s, border-color 0.3s",
    textDecoration: "none",
  },

  forgot: {
    color: "#9A9A9A",
    textDecoration: "none",
  },

  a_account: {
    color: "#9A9A9A",
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

export default LoginForm;
