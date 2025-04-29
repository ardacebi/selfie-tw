import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const getSystemTheme = () => window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  
  const [theme, setTheme] = useState(() => 
    typeof window === "undefined" ? "light" : localStorage.getItem("theme") || getSystemTheme()
  );
  
  const [isSystemTheme, setIsSystemTheme] = useState(
    typeof window !== "undefined" && !localStorage.getItem("theme")
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => isSystemTheme && setTheme(getSystemTheme());
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystemTheme]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsSystemTheme(false);
    setTheme(theme === "light" ? "dark" : "light");
  };

  const resetToSystemTheme = () => {
    setIsSystemTheme(true);
    localStorage.removeItem("theme");
    setTheme(getSystemTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isSystemTheme, resetToSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };