import { createContext, useState } from "react";

const CurrentDateContext = createContext(null);

const CurrentDateProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </CurrentDateContext.Provider>
  );
};

export { CurrentDateContext, CurrentDateProvider };
