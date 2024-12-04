import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";

const LoginForm = () => {
  return (
    <div>
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaLock className="icon" />
        </div>
        <div className="remember-me-button">
          <label>
            <input type="checkbox" />
            Remember Me
            <Link to="/register">Don't have an account?</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
