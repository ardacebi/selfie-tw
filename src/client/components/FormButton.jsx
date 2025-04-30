import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import commonStyles from "../styles/commonStyles";

const FormButton = ({ type = "submit", onClick, children, style = {}, width = "100%" }) => {
  const { theme } = useContext(ThemeContext);
  const themeStyles = commonStyles.getThemeStyles(theme);
  
  return (
    <button 
      type={type}
      onClick={onClick}
      style={{
        ...commonStyles.button,
        backgroundColor: themeStyles.inputBg,
        color: themeStyles.inputColor,
        borderColor: themeStyles.borderColor,
        width,
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default FormButton;