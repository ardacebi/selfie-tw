import { useContext, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { FaSun, FaMoon, FaCog, FaSignOutAlt, FaInfo } from "react-icons/fa";
import commonStyles from "../styles/commonStyles";
import logo from "../assets/logo.png";
import logo_dark from "../assets/logo_dark.png";

const Navbar = () => {
  const { theme, toggleTheme, isSystemTheme, resetToSystemTheme } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
  const buttonLeaveTimeoutRef = useRef(null);
  const navigate = useNavigate();
  
  const isDark = theme === 'dark';
  const themeStyles = commonStyles.getThemeStyles(theme);
  
  const colors = {
    moon: "#FFD700",
    sun: "#DAA520",
    bg: isDark ? '#1e1e1e' : '#ffffff',
    border: isDark ? '#444' : '#dcdcdc',
    tooltipBg: isDark ? '#333' : '#fff',
    tooltipBorder: isDark ? '#444' : '#ddd',
    resetBtnBg: isDark ? '#222' : '#f0f0f0',
    resetBtnBorder: isDark ? '#555' : '#ccc',
    iconColor: isDark ? '#e0e0e0' : '#555555',
  };
  
  const getThemeIcon = () => {
    if (isSystemTheme) {
      return isDark ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMoon style={{ marginRight: '4px', color: colors.moon }} />
          <FaCog size={12} />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaSun style={{ marginRight: '4px', color: colors.sun }} />
          <FaCog size={12} />
        </div>
      );
    }
    return isDark ? <FaMoon color={colors.moon} /> : <FaSun color={colors.sun} />;
  };

  const handleLogout = () => {
    localStorage.removeItem("savedUser");
    setCurrentUser(null);
    navigate("/", { replace: true });
  };

  const renderTooltip = (content) => (
    <div
      style={{
        position: 'absolute',
        right: '0',
        top: '45px',
        backgroundColor: colors.tooltipBg,
        color: themeStyles.inputColor,
        border: `1px solid ${colors.tooltipBorder}`,
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
      onMouseEnter={() => setIsTooltipHovered(true)}
      onMouseLeave={() => setIsTooltipHovered(false)}
    >
      {content}
    </div>
  );

  const renderThemeButton = () => (
    <div
      style={{ position: 'relative', display: 'inline-block', marginRight: currentUser ? '10px' : '0' }}
      onMouseEnter={() => {
        clearTimeout(buttonLeaveTimeoutRef.current);
        setIsButtonHovered(true);
      }}
      onMouseLeave={() => {
        buttonLeaveTimeoutRef.current = setTimeout(() => {
          if (!isTooltipHovered) {
            setIsButtonHovered(false);
          }
        }, 100);
      }}
    >
      <button
        onClick={toggleTheme}
        style={{
          ...styles.themeButton,
          backgroundColor: themeStyles.inputBg,
          color: themeStyles.inputColor,
          border: `2px solid ${colors.border}`
        }}
      >
        {getThemeIcon()}
      </button>
      {(isButtonHovered || isTooltipHovered) && (
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '45px',
            backgroundColor: colors.tooltipBg,
            color: themeStyles.inputColor,
            border: `1px solid ${colors.tooltipBorder}`,
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={() => {
            clearTimeout(buttonLeaveTimeoutRef.current);
            setIsTooltipHovered(true);
          }}
          onMouseLeave={() => {
            setIsTooltipHovered(false);
            if (!isButtonHovered) {
              setIsButtonHovered(false);
            }
          }}
        >
          {isSystemTheme ? 'Using system theme' : 'Using your saved preference'}
          {!isSystemTheme && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetToSystemTheme();
                setIsButtonHovered(false);
                setIsTooltipHovered(false);
              }}
              style={{
                display: 'block',
                marginTop: '5px',
                fontSize: '10px',
                padding: '3px 6px',
                backgroundColor: colors.resetBtnBg,
                border: `1px solid ${colors.resetBtnBorder}`,
                borderRadius: '3px',
                cursor: 'pointer',
                color: themeStyles.inputColor,
              }}
            >
              Reset to system theme
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderInfoButton = () => (
    <div
      style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}
      onMouseEnter={() => setShowInfoTooltip(true)}
      onMouseLeave={() => setShowInfoTooltip(false)}
    >
      <button
        style={{
          ...styles.themeButton,
          backgroundColor: themeStyles.inputBg,
          color: themeStyles.inputColor,
          border: `2px solid ${colors.border}`
        }}
      >
        <FaInfo color={colors.iconColor} />
      </button>
      {showInfoTooltip && renderTooltip(
        "Progetto di corso Tecnologie Web fatta da Alessandro D'Ambrosio e Arda Çebi."
      )}
    </div>
  );

  return (
    <nav style={{
      ...styles.navbar,
      backgroundColor: colors.bg,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div style={styles.navContainer}>
        <div style={styles.logoContainer}>
          <NavLink to="/">
            <img style={styles.logo} src={isDark ? logo_dark : logo} alt="Selfie Logo" />
          </NavLink>
        </div>
        <div style={styles.controlsContainer}>
          {renderInfoButton()}
          {renderThemeButton()}
          {currentUser && (
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setShowLogoutTooltip(true)}
              onMouseLeave={() => setShowLogoutTooltip(false)}
            >
              <button
                onClick={handleLogout}
                style={{
                  ...styles.themeButton,
                  backgroundColor: themeStyles.inputBg,
                  color: themeStyles.inputColor,
                  border: `2px solid ${colors.border}`
                }}
              >
                <FaSignOutAlt color={colors.iconColor} />
              </button>
              {showLogoutTooltip && renderTooltip('Log out')}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s, color 0.3s',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    padding: '0 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '120px',
    height: 'auto',
  },
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  themeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s',
  },
};

export default Navbar;