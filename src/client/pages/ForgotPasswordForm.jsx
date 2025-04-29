import { useMutation } from "@tanstack/react-query";
import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import postNewPassword from "../data_creation/postNewPassword.js";
import { ThemeContext } from "../contexts/ThemeContext.jsx";
import FormInput from "../components/FormInput.jsx";
import FormButton from "../components/FormButton.jsx";
import commonStyles from "../styles/commonStyles.js";
import selfieImg from '../assets/selfie_forgot.png';

const ForgotPasswordForm = () => {
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

  const resetPassword = useMutation(postNewPassword, {
    onMutate: () => { document.querySelector("#error_text").style.visibility = "hidden"; },
    onSuccess: () => {
      navigate("/login", { 
        replace: true,
        state: { fromPasswordReset: true }
      });
    },
    onError: (error) => {
      setError(error.message);
      document.querySelector("#error_text").style.color = "red";
      document.querySelector("#error_text").style.visibility = "visible";
    },
  });

  return (
    <div>
      <div style={commonStyles.headerContainer}>
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
      
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <img src={selfieImg} alt="Selfie" style={{...commonStyles.logo, marginBottom: "5px"}} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          resetPassword.mutate({
            email: formData.get("email") ?? "",
            password: formData.get("password") ?? "",
          });
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={commonStyles.gradientTitle(theme)} key={theme}>
            Forgot Password
          </div>
        </div>
        
        <FormInput
          name="email"
          placeholder="Email"
          required={true}
        />

        <FormInput
          name="password"
          type="password"
          placeholder="New Password"
          required={true}
        />
        
        <FormButton>Change Password</FormButton>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: theme === 'dark' ? '#444' : '#f8f8f8',
        border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'flex-start',
        width: '278px',
      }}>
        <div style={{ 
          marginRight: '10px',
          backgroundColor: theme === 'dark' ? '#666' : '#e0e0e0',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          color: theme === 'dark' ? '#fff' : '#444',
          minWidth: '24px',
          flexShrink: 0,
        }}>
          i
        </div>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: theme === 'dark' ? '#ccc' : '#666',
        }}>
          In production environments, password changes require email verification for security. This is not the case in this educational project. Without this verification, any user could change another user's password, which is not expected practice.
        </p>
      </div>

      <p id="error_text" style={{...commonStyles.errorText, fontFamily: "sans-serif"}}>{error}</p>
    </div>
  );
};

export default ForgotPasswordForm;
