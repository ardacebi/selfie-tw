import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
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
  const themeStyles = commonStyles.getThemeStyles(theme);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = commonStyles.getDynamicCSS(theme);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

  const signup = useMutation(postAccountData, {
    onMutate: () => {
      document.querySelector("#error_text").style.visibility = "hidden";
    },
    onSuccess: () => {
      setError("Success! You signed up!");
      document.querySelector("#error_text").style.color = "green";
      document.querySelector("#error_text").style.visibility = "visible";
      navigate("/login", { replace: true });
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
          signup.mutate({
            email: formData.get("email") ?? "",
            username: formData.get("username") ?? "",
            password: formData.get("password") ?? "",
          });
        }}
      >
        <h1 style={{...commonStyles.pageTitle, color: themeStyles.titleColor, marginBottom: "20px"}}>Sign Up</h1>
        
        <FormInput 
          name="email"
          placeholder="Email"
          required={true}
        />

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

        <FormButton>Create Account</FormButton>

        <NavLink 
          style={{...commonStyles.accountLink, color: themeStyles.linkColor}} 
          to="/login"
        >
          Already have an account?
        </NavLink>
      </form>

      <p id="error_text" style={commonStyles.errorText}>{error}</p>
    </div>
  );
};

export default SignUpForm;
