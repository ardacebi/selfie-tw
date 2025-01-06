import { useMutation } from "@tanstack/react-query";
import postAccountData from "../data_creation/postAccountData.js";

const SignUpForm = () => {
  const mutateAccount = useMutation(postAccountData, {
    onSuccess: (data) => {
      console.log("Account created successfuly! ", data);
    },
    onError: (error) => {
      console.error("Error creating account: ", error);
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
      </form>
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
};

export default SignUpForm;
