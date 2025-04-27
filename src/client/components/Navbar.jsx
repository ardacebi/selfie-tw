import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { FaSun, FaMoon, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import logo_dark from "../assets/logo_dark.png";

const Navbar = () => {
  const { theme, toggleTheme, isSystemTheme, resetToSystemTheme } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
  const navigate = useNavigate();
  
  const isDark = theme === 'dark';
  const colors = {
    moon: "#FFD700",
    sun: "#DAA520",
    bg: isDark ? '#1e1e1e' : '#ffffff',
    border: isDark ? '#333' : '#dcdcdc',
    btnBg: isDark ? '#333' : '#fff',
    btnColor: isDark ? '#fff' : '#000',
    tooltipBg: isDark ? '#333' : '#fff',
    tooltipColor: isDark ? '#fff' : '#000',
    tooltipBorder: isDark ? '#444' : '#ddd',
    resetBtnBg: isDark ? '#222' : '#f0f0f0',
    resetBtnBorder: isDark ? '#555' : '#ccc',
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
        color: colors.tooltipColor,
        border: `1px solid ${colors.tooltipBorder}`,
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
    >
      {content}
    </div>
  );

  const renderThemeButton = () => (
    <div
      style={{ position: 'relative', display: 'inline-block', marginRight: currentUser ? '10px' : '0' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={toggleTheme}
        style={{
          ...styles.themeButton,
          backgroundColor: colors.btnBg,
          color: colors.btnColor,
          border: `2px solid ${colors.border}`
        }}
      >
        {getThemeIcon()}
      </button>
      {showTooltip && renderTooltip(
        <>
          {isSystemTheme ? 'Using system theme' : 'Using your saved preference'}
          {!isSystemTheme && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetToSystemTheme();
                setShowTooltip(false);
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
                color: colors.tooltipColor,
              }}
            >
              Reset to system theme
            </button>
          )}
        </>
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
                  backgroundColor: colors.btnBg,
                  color: colors.btnColor,
                  border: `2px solid ${colors.border}`
                }}
              >
                <FaSignOutAlt />
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