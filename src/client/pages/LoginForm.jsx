import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
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
  const location = useLocation();
  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const [showPasswordResetSuccess, setShowPasswordResetSuccess] = useState(false);
  const { setCurrentUser } = useContext(CurrentUserContext);
  const themeStyles = commonStyles.getThemeStyles(theme);
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = commonStyles.getDynamicCSS(theme);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);
  
  useEffect(() => {
    const { state } = location;
    if (!state) return;
    
    const showSuccess = (flag, timeout = 10000) => {
      flag(true);
      const timerId = setTimeout(() => window.history.replaceState({}, document.title), timeout);
      return () => clearTimeout(timerId);
    };
    
    if (state.fromSignup) return showSuccess(setShowSignupSuccess);
    if (state.fromPasswordReset) return showSuccess(setShowPasswordResetSuccess);
  }, [location]);
  
  const login = useMutation(fetchLoginData, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: (res) => {
      setCurrentUser(res.data._id);
      if (rememberMe) localStorage.setItem("savedUser", res.data._id);
      navigate("/", { replace: true });
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  // Banner styles
  const getBannerStyle = (type, visible) => ({
    ...commonStyles.baseBannerStyle,
    ...commonStyles[type](theme, visible ? "flex" : "none")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    login.mutate({
      username: formData.get("username") ?? "",
      password: formData.get("password") ?? "",
    });
  };
  
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
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={commonStyles.gradientTitle(theme)} key={theme}>
            Log In
          </div>
        </div>
        
        <FormInput name="username" placeholder="Username" required={true} />
        <FormInput name="password" type="password" placeholder="Password" required={true} />
        
        <div className="remember-me-button">
          <label style={{ color: themeStyles.linkColor }}>
            <input type="checkbox" onChange={(e) => setRememberMe(e.target.checked)} />
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

        <div style={getBannerStyle("errorBannerStyle", showErrorBanner)}>
          <FaExclamationCircle style={commonStyles.bannerIconStyle} />
          <span>{error}</span>
        </div>
        
        <div style={getBannerStyle("successBannerStyle", showSignupSuccess)}>
          <FaCheckCircle style={commonStyles.bannerIconStyle} />
          <span>Account created successfully! You can now log in with your credentials.</span>
        </div>
        
        <div style={getBannerStyle("successBannerStyle", showPasswordResetSuccess)}>
          <FaCheckCircle style={commonStyles.bannerIconStyle} />
          <span>Success! The password has been changed! You can now log in with your new password.</span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
