import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import fetchLoginData from "../data_fetching/fetchLoginData.js";

const LoginForm = () => {
  const mutateAccount = useMutation(fetchLoginData, {
    onSuccess: (data) => {
      console.log('Account found! Logged in! ', data);
    },
    onError: (error) => {
      console.error('Error finding account: ', error);
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
            <input style={styles.field}
              name="username"
              id="username"
              type="text"
              placeholder="Username"
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
              placeholder="Password"
              required
            />
          
          </div><br></br>
        </label>
        <div className="remember-me-button">
          <label style={{ color: 'black' }}>
            <input type="checkbox" />
            Remember Me
          </label>
        </div><br></br>
        <button type="submit" style={styles.button}>Login</button><br></br><br></br><br></br>

        <Link to="/sign_up">Don't have an account?</Link><br></br><br></br>
        <Link to="/forgot_password">Forgot Password?</Link>
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
};

export default LoginForm;
