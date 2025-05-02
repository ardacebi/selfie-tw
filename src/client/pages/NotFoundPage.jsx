import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import BlurredWindow from "../components/BlurredWindow";
import AnimatedBackButton from "../components/AnimatedBackButton";
import commonStyles from "../styles/commonStyles";
import notFoundImage from "../assets/404.png";

const NotFoundPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      <BlurredWindow width="450px">
        <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={commonStyles.pages.notFound.title(theme)} key={`404-${theme}`}>
            404
          </div>
          
          <img src={notFoundImage} alt="404 Error" style={commonStyles.pages.notFound.image} />
          
          <div style={commonStyles.pages.notFound.subtitle(theme)}>
            I'm afraid I can't do that.
          </div>
          
          <NavLink 
            to="/"
            style={commonStyles.pages.notFound.homeButton(theme)}
          >
            Return Home
          </NavLink>
        </div>
      </BlurredWindow>
    </div>
  );
};

export default NotFoundPage;