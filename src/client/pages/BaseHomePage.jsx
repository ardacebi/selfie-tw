import { NavLink, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useContext, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import commonStyles from "../styles/commonStyles";
import selfieImg from '../assets/selfie.png';

const BaseHomePage = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const themeStyles = commonStyles.getThemeStyles(theme);
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `button:hover, a:hover {background-color: ${themeStyles.hoverBg} !important;}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [themeStyles.hoverBg]);

  const getNavStyle = isActive => ({
    ...commonStyles.button,
    backgroundColor: isActive ? themeStyles.activeBg : themeStyles.inputBg,
    color: themeStyles.inputColor,
    borderColor: themeStyles.borderColor,
  });

  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={{...styles.form, backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img src={selfieImg} alt="Selfie" style={{...commonStyles.logo, marginBottom: '15px'}} />
          <div style={commonStyles.welcomeGradient(theme)} key={theme}>
            Welcome to Selfie!
          </div>
          <div style={{...styles.navContainer, marginTop: '15px'}}>
            <NavLink style={({isActive}) => ({...getNavStyle(isActive), marginRight: "5px"})} to="/login">Log In</NavLink>
            <NavLink style={({isActive}) => getNavStyle(isActive)} to="/sign_up">Sign Up</NavLink>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <div style={{...styles.form, backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <img src={selfieImg} alt="Selfie" style={{...commonStyles.logo, marginBottom: '15px'}} />
        
        <div style={commonStyles.welcomeGradient(theme)} key={theme}>
          Welcome to Selfie! You are now logged in.
        </div>
        
        <div style={{...styles.userIdBox, backgroundColor: themeStyles.inputBg, borderColor: themeStyles.borderColor, marginBottom: '20px'}}>
          <p style={{...styles.userId, color: themeStyles.inputColor}}>            User ID: {currentUser}          </p>
        </div>
        
        <button
          style={{            ...styles.button, ...styles.calendarButton,             backgroundColor: themeStyles.inputBg,             color: themeStyles.inputColor,             borderColor: themeStyles.borderColor          }}
          onClick={() => navigate("/calendar", { replace: true })}
        >
          <FaCalendarAlt style={styles.calendarIcon} />
          Calendar
        </button>

        <button
          style={{            ...styles.button,             backgroundColor: themeStyles.inputBg,             color: themeStyles.inputColor,             borderColor: themeStyles.borderColor          }}
          onClick={() => navigate("/calendar", { replace: true })}
        >
          Notes Editor
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center", width: "100%" },
  form: { padding: "10px", display: "inline-block", marginTop: "100px", marginBottom: "30px" },
  navContainer: { display: "flex", justifyContent: "center" },
  button: { ...commonStyles.button, width: "auto", minWidth: "120px" },
  calendarButton: { display: "flex", flexDirection: "column", alignItems: "center" },
  calendarIcon: { fontSize: '32px', marginBottom: '8px' },
  userIdBox: { display: 'inline-block', border: '2px solid', borderRadius: '10px', padding: '5px 10px', marginTop: '5px' },
  userId: { fontFamily: 'monospace', fontSize: '18px', margin: '0' }
};

export default BaseHomePage;
