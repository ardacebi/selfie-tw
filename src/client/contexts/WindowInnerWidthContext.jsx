import { createContext, useState } from "react";

const WindowInnerWidthContext = createContext(null);

const WindowInnerWidthProvider = ({ children }) => {
  const [innerWidth, setInnerWidth] = useState(
    typeof window === "undefined" ? 1080 : window.innerWidth,
  );
  const updateInnerWidth = () => {
    setInnerWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateInnerWidth);
    return () => window.removeEventListener("resize", updateInnerWidth);
  }, []);

  return (
    <WindowInnerWidthContext.Provider value={{ innerWidth, updateInnerWidth }}>
      {children}
    </WindowInnerWidthContext.Provider>
  );
};

export { WindowInnerWidthContext, WindowInnerWidthProvider };
