import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import commonStyles from "../styles/commonStyles";

const FormInput = ({ 
  type = "text", 
  name, 
  id, 
  placeholder, 
  required = false, 
  style = {},
  marginBottom = "15px"
}) => {
  const { theme } = useContext(ThemeContext);
  const themeStyles = commonStyles.getThemeStyles(theme);
  
  return (
    <label htmlFor={id || name}>
      <input
        style={{
          ...commonStyles.field,
          backgroundColor: themeStyles.inputBg,
          color: themeStyles.inputColor,
          marginBottom: marginBottom,
          borderColor: themeStyles.borderColor,
          ...style
        }}
        name={name}
        id={id || name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
      <br />
    </label>
  );
};

export default FormInput;