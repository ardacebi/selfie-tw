import { useContext, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { createRoot } from "react-dom/client";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import BaseHomePage from "./pages/BaseHomePage";
import CalendarPage from "./pages/CalendarPage";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import { CurrentDateContext } from "./contexts/CurrentDateContext";

const savedUser = () =>
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage.getItem("savedUser")
    : null;

const App = () => {
  const { setCurrentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    setCurrentUser(savedUser());
  }, [setCurrentUser]);
  useEffect(() => {
    // Only run on the client
    const style = document.createElement("style");
    style.innerHTML = `
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        background-color: #f8f7f5;
      }
    `;
    document.head.appendChild(style);
    // Cleanup if needed:
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.form}>
          <NavLink to="/">
            <img
              style={styles.logo}
              src="/client/assets/logo.png"
              alt="Selfie Logo"
            />
          </NavLink>
          <br></br>
        </div>
      </header>
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<BaseHomePage />} />
          <Route path="/login" element={<LoginForm style={styles.card} />} />
          <Route path="/sign_up" element={<SignUpForm style={styles.card} />} />
          <Route
            path="/forgot_password"
            element={<ForgotPasswordForm style={styles.card} />}
          />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </main>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f8f7f5",
    minHeight: "100vh",
    color: "black",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
  },
  header: {
    padding: "20px",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#f8f7f5",
    padding: "10px",
    display: "inline-block",
    marginTop: "200px",
    marginBottom: "30px",
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    width: "50%",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  logo: {
    width: "200px",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#fff",
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "100px",
    padding: "10px 25px",
    fontSize: "16px",
    color: "#000",
    cursor: "pointer",
    transition: "background-color 0.3s, border-color 0.3s",
    textDecoration: "none",
  },
  button1: {
    marginRight: "5px",
  },
};

/*
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <CurrentDateProvider>
          <App />
        </CurrentDateProvider>
      </CurrentUserProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);


const style = document.createElement("style");
style.innerHTML = `
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #f8f7f5;
  }
`;
document.head.appendChild(style);
*/

export default App;
