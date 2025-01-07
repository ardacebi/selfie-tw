import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import postNewPassword from "../data_creation/postNewPassword.js";

const ForgotPasswordForm = () => {
  const [accountCreationError, setAccountCreationError] = useState("no error");

  const mutateAccount = useMutation(postNewPassword, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: (res) => {
      console.log("Account found! Password changed! ", res);
      setAccountCreationError("Success! The password has been changed!");
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
            password: formData.get("password") ?? "",
          };
          mutateAccount.mutate(userDataObj);
        }}
      >
        <h1 style={styles.title}>Forgot Password</h1>
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

        <label htmlFor="password">
          <div className="input-box">
            <input
              style={styles.field}
              name="password"
              id="password"
              type="password"
              placeholder="New Password"
              required
            />
          </div>
          <br></br>
        </label>
        <button type="submit" style={styles.button}>
          Change Password
        </button>
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

  title: {
    color: "black",
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
