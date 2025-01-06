import { NavLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import postAccountData from "../data_creation/postAccountData.js";

const SignUpForm = () => {
  const [accountCreationError, setAccountCreationError] = useState("no error");

  const mutateAccount = useMutation(postAccountData, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: (data) => {
      console.log("Account created successfully! ", data);
      setAccountCreationError("Success! You signed up!");
      document.querySelector("#error_text").style.color = "green";
      document.querySelector("#error_text").style.visibility = "visible";
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
            email: formData.get("email") ?? "",
            username: formData.get("username") ?? "",
            password: formData.get("password") ?? "",
          };
          mutateAccount.mutate(userDataObj);
        }}
      >
        <label htmlFor="email">
          <div className="input-box">
            <input
              style={styles.field}
              name="email"
              id="email"
              type="text"
              placeholder="Email"
              required
            />
          </div>
          <br></br>
        </label>

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
        <button type="submit" style={styles.button}>
          Create Account
        </button>

        <NavLink style={styles.a_account} to="/login">
          Already have an account?
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

  error_text: {
    color: "gray",
    fontSize: "18px",
    visibility: "hidden",
    textAlign: "center",
  },

  a_account: {
    color: "#9A9A9A",
    textDecoration: "none",
    display: "block",
    padding: "15px 0px",
  },
};

export default SignUpForm;
