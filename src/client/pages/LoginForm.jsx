import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import fetchLoginData from "../data_fetching/fetchLoginData.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import { ThemeContext } from "../contexts/ThemeContext.jsx";
import FormInput from "../components/FormInput.jsx";
import FormButton from "../components/FormButton.jsx";
import commonStyles from "../styles/commonStyles.js";
import selfieImg from '../assets/selfie_locked.png';

const LoginForm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setCurrentUser } = useContext(CurrentUserContext);
  const themeStyles = commonStyles.getThemeStyles(theme);
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = commonStyles.getDynamicCSS(theme);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);
  
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
      <div style={{...commonStyles.headerContainer, marginBottom: "20px"}}>
        <NavLink
          style={{
            ...commonStyles.backButton,
            backgroundColor: themeStyles.inputBg,
            color: themeStyles.inputColor,
            borderColor: themeStyles.borderColor,
          }}
          to="/"
        >
          <FaArrowLeft style={{ marginRight: '8px' }} /> Go back
        </NavLink>
      </div>
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src={selfieImg} alt="Selfie" style={commonStyles.logo} />
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
        <h1 style={{...commonStyles.pageTitle, color: themeStyles.titleColor, marginBottom: "20px"}}>Log In</h1>
        
        <FormInput 
          name="username"
          placeholder="Username"
          required={true}
        />

        <FormInput 
          name="password"
          type="password"
          placeholder="Password"
          required={true}
        />
        
        <div className="remember-me-button">
          <label style={{ color: themeStyles.linkColor }}>
            <input
              type="checkbox"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <br />
        
        <FormButton>Log In</FormButton>
        <br /><br />

        <NavLink style={{...commonStyles.link, color: themeStyles.linkColor}} to="/forgot_password">
          Forgot your password?
        </NavLink>

        <NavLink style={{...commonStyles.accountLink, color: themeStyles.linkColor}} to="/sign_up">
          Don't have an account? Sign up.
        </NavLink>
      </form>

      <p id="error_text" style={commonStyles.errorText}>{error}</p>
    </div>
  );
};

export default LoginForm;
