import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

/**
 * PageTransition component - Provides a consistent fade-in transition for all pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string|number} [props.key]
 * @returns {React.ReactNode}
 */
const PageTransition = ({ children }) => {
  const [showContent, setShowContent] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setShowContent(false);
    
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-transition-container" style={{
      opacity: showContent ? 1 : 0,
      transform: showContent ? 'scale(1)' : 'scale(0.98)',
      filter: showContent ? 'blur(0)' : 'blur(5px)',
      transition: 'opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1), filter 450ms cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%'
    }}>
      {children}
    </div>
  );
};

export default PageTransition;