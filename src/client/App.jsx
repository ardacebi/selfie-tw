import { useContext, useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import BaseHomePage from "./pages/BaseHomePage";
import CalendarPage from "./pages/CalendarPage";
import NotesPage from "./pages/NotesPage";
import NotesEditor from "./pages/NotesEditor";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import SubNavbar from "./components/SubNavbar";
import TimeMachine from "./components/TimeMachine";
import ProtectedRoute from "./components/ProtectedRoute";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import { ThemeContext } from "./contexts/ThemeContext";
import commonStyles from "./styles/commonStyles";
import EventsEditor from "./pages/EventsEditor";
import ActivitiesEditor from "./pages/ActivitiesEditor";

const savedUser = () => window?.localStorage?.getItem("savedUser") ?? null;

const App = () => {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const { theme, isTransitioning } = useContext(ThemeContext);
  const animationRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    setCurrentUser(savedUser());
  }, [setCurrentUser]);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#000000" : "#ffffff",
      );
    }
  }, [theme]);

  // global theme transition styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = commonStyles.themeTransition.getGlobalStyles(theme);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

  // Star animation
  useEffect(() => {
    if (theme === "dark") {
      // clean up
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (window.starAnimationResizeHandler) {
        window.removeEventListener("resize", window.starAnimationResizeHandler);
        window.starAnimationResizeHandler = null;
      }

      setTimeout(() => {
        const backgroundCanvas = document.getElementById("backgroundCanvas");
        const starsCanvas = document.getElementById("starsCanvas");
        const milkyWayCanvas = document.getElementById("milkyWayCanvas");
      }, 0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (window.starAnimationResizeHandler) {
        window.removeEventListener("resize", window.starAnimationResizeHandler);
        window.starAnimationResizeHandler = null;
      }
    };
  }, [theme]);

  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#000000" : "#f8f7f5",
    cardBg: isDark ? "#1e1e1e" : "#fff",
    text: isDark ? "#e0e0e0" : "black",
  };

  return (
    <>
      {/* Background with transition effects */}
      <div
        className={`page-background ${isTransitioning ? "transitioning" : ""}`}
      ></div>

      <div style={{ ...commonStyles.appShell.page, color: colors.text }}>
        <Navbar />
        <SubNavbar />
        <TimeMachine />
        <main
          style={{
            ...commonStyles.appShell.mainContent,
            paddingTop: isMobile ? "65px" : "110px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<BaseHomePage isMobile={isMobile} />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/sign_up" element={<SignUpForm />} />
            <Route path="/forgot_password" element={<ForgotPasswordForm />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar/:eventID"
              element={
                <ProtectedRoute>
                  <EventsEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar/activities_editor/:activityID"
              element={
                <ProtectedRoute>
                  <ActivitiesEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pomodoro"
              element={
                <ProtectedRoute>
                  <div>Pomodoro Page</div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/:noteID"
              element={
                <ProtectedRoute>
                  <NotesEditor />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
