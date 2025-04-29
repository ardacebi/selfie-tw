import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import postAccountData from "../data_creation/postAccountData.js";
import { ThemeContext } from "../contexts/ThemeContext.jsx";
import FormInput from "../components/FormInput.jsx";
import FormButton from "../components/FormButton.jsx";
import commonStyles from "../styles/commonStyles.js";
import selfieImg from '../assets/selfie_signup.png';

const SignUpForm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const themeStyles = commonStyles.getThemeStyles(theme);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = commonStyles.getDynamicCSS(theme);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

  const signup = useMutation(postAccountData, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: () => navigate("/login", { replace: true, state: { fromSignup: true } }),
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    signup.mutate({
      email: formData.get("email") ?? "",
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
            Sign Up
          </div>
        </div>
        
        <FormInput name="email" placeholder="Email" required={true} />
        <FormInput name="username" placeholder="Username" required={true} />
        <FormInput name="password" type="password" placeholder="Password" required={true} />

        <FormButton>Create Account</FormButton>

        <NavLink 
          style={{...commonStyles.accountLink, color: themeStyles.linkColor}} 
          to="/login"
        >
          Already have an account?
        </NavLink>

        <div style={{
          ...commonStyles.baseBannerStyle,
          ...commonStyles.errorBannerStyle(theme, showErrorBanner ? "flex" : "none"),
        }}>
          <FaExclamationCircle style={commonStyles.bannerIconStyle} />
          <span>{error}</span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
