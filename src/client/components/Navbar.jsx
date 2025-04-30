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
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
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
  
  const handleLogout = () => {
    localStorage.removeItem("savedUser");
    setCurrentUser(null);
    navigate("/", { replace: true });
  };

  const handleMouseEnter = (tooltipId) => {
    clearTimeout(buttonLeaveTimeoutRef.current);
    setActiveTooltip(tooltipId);
  };

  const handleMouseLeave = () => {
    buttonLeaveTimeoutRef.current = setTimeout(() => {
      if (!isTooltipHovered) setActiveTooltip(null);
    }, 100);
  };

  const renderTooltip = (id, content) => (
    activeTooltip === id && (
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
        onMouseLeave={() => {
          setIsTooltipHovered(false);
          setActiveTooltip(null);
        }}
      >
        {content}
      </div>
    )
  );

  const NavButton = ({ icon, onClick, tooltipId, tooltipContent }) => (
    <div
      style={{ position: 'relative', display: 'inline-block', marginRight: tooltipId !== 'logout' ? '10px' : '0' }}
      onMouseEnter={() => handleMouseEnter(tooltipId)}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={onClick}
        style={{
          ...buttonStyle,
          backgroundColor: themeStyles.inputBg,
          color: themeStyles.inputColor,
          border: `2px solid ${colors.border}`
        }}
      >
        {icon}
      </button>
      {renderTooltip(tooltipId, tooltipContent)}
    </div>
  );

  const themeIcon = isSystemTheme ? 
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isDark ? <FaMoon style={{ marginRight: '4px', color: colors.moon }} /> : <FaSun style={{ marginRight: '4px', color: colors.sun }} />}
      <FaCog size={12} />
    </div> 
    : isDark ? <FaMoon color={colors.moon} /> : <FaSun color={colors.sun} />;

  const themeTooltipContent = (
    <>
      {isSystemTheme ? 'Using system theme' : 'Using your saved preference'}
      {!isSystemTheme && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetToSystemTheme();
            setActiveTooltip(null);
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
    </>
  );

  const buttonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s',
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'background-color 0.3s, color 0.3s',
      backgroundColor: colors.bg,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        padding: '0 20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <NavLink to="/">
          <img style={{ width: '120px', height: 'auto' }} src={isDark ? logo_dark : logo} alt="Selfie Logo" />
        </NavLink>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavButton 
            icon={<FaInfo color={colors.iconColor} />}
            tooltipId="info"
            tooltipContent="Progetto di corso Tecnologie Web fatta da Alessandro D'Ambrosio e Arda Çebi."
          />
          <NavButton 
            icon={themeIcon}
            onClick={toggleTheme}
            tooltipId="theme" 
            tooltipContent={themeTooltipContent}
          />
          {currentUser && (
            <NavButton 
              icon={<FaSignOutAlt color={colors.iconColor} />}
              onClick={handleLogout}
              tooltipId="logout" 
              tooltipContent="Log out"
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;