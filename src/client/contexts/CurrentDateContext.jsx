import { createContext, useState, useEffect } from "react";

const CurrentDateContext = createContext(null);

const CurrentDateProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </CurrentDateContext.Provider>
  );
};

export { CurrentDateContext, CurrentDateProvider };
