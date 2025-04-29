import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import BaseHomePage from "./pages/BaseHomePage";
import CalendarPage from "./pages/CalendarPage";
import Navbar from "./components/Navbar";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import { ThemeContext } from "./contexts/ThemeContext";

const savedUser = () => window?.localStorage?.getItem("savedUser") ?? null;

const App = () => {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const { theme } = useContext(ThemeContext);
  
  useEffect(() => {
    setCurrentUser(savedUser());
  }, [setCurrentUser]);
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        background-color: ${theme === 'dark' ? '#121212' : '#f8f7f5'};
        color: ${theme === 'dark' ? '#e0e0e0' : 'black'};
        transition: background-color 0.3s, color 0.3s;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);
  
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#121212' : '#f8f7f5',
    cardBg: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#e0e0e0' : 'black'
  };
  
  return (
    <div style={{...styles.page, backgroundColor: colors.bg, color: colors.text}}>
      <Navbar />
      <main style={{...styles.mainContent, paddingTop: '80px'}}>
        <Routes>
          <Route path="/" element={<BaseHomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/sign_up" element={<SignUpForm />} />
          <Route path="/forgot_password" element={<ForgotPasswordForm />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
    transition: "background-color 0.3s, color 0.3s",
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  }
};

export default App;
