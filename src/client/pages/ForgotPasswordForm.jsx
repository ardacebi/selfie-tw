import { FaLock, FaMailBulk } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import postNewPassword from "../data_creation/postNewPassword.js";

const ForgotPasswordForm = () => {
  const mutateAccount = useMutation(postNewPassword, {
    onSuccess: (data) => {
      console.log('Account found! Password changed! ', data);
    },
    onError: (error) => {
      console.error('Error changing password: ', error);
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
            <input style={styles.field}
              name="email"
              id="email"
              type="text"
              placeholder="Email"
              required
            />
          </div><br></br>
        </label>

        <label htmlFor="password">
          <div className="input-box">
            <input style={styles.field}
              name="password"
              id="password"
              type="password"
              placeholder="New Password"
              required
            />
          </div><br></br>
        </label>
        <button type="submit" style={styles.button}>Change Password</button>
      </form>
    </div>
  );
};

const styles = {
  field: {
    backgroundColor: '#fff', 
    border: '2px solid #dcdcdc',
    borderRadius: '10px',
    width: '250px',
    padding: '10px 25px', 
    fontSize: '16px', 
    color: '#000', 
    transition: 'background-color 0.3s, border-color 0.3s', 
    textDecoration: 'none',
  },

  button: {
    backgroundColor: '#fff', 
    border: '2px solid #dcdcdc',
    borderRadius: '10px',
    width: '300px',
    cursor: 'pointer',
    padding: '10px 25px', 
    fontSize: '16px', 
    color: '#000', 
    transition: 'background-color 0.3s, border-color 0.3s', 
    textDecoration: 'none',
  },

  forgot: {
    color: '#9A9A9A',
    textDecoration: 'none',
  },

  title: {
    color: 'black',
    textAlign: 'center',
  } 
};

export default ForgotPasswordForm;
