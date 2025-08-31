import { useContext, useState, useEffect } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import commonStyles from "../styles/commonStyles.js";

const TimeMachine = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 992,
  );
  
  const { currentDate, setCurrentDate, manualControl, setManualControl } =
    useContext(CurrentDateContext);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  
    const isMobile = windowWidth < 576;

  const handleManualControlToggle = () => {
    setManualControl((prev) => !prev);
  };
  const handleMoreHour = () => {
    const newDate = new Date(currentDate);
    newDate.setHours(newDate.getHours() + 1);
    setCurrentDate(newDate);
  };

  return (

    <div>
      { /* Time machine visibility button */ }
      <nav
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "5px 5px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "500px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <button onClick={toggleVisibility}>x</button>

        {true && (
          <>
            { /* Time machine container */ }
            <nav
              style={commonStyles.timeMachine.timeMachineContainer(isMobile, isVisible)
              }
            >
              <h2>Time Machine</h2>
              <p>Current Date: {currentDate.toString()}</p>
              <button onClick={handleManualControlToggle}>
                {manualControl ? "Stop Manual Control" : "Start Manual Control"}
              </button>
              <button onClick={handleMoreHour}>More hour</button>
            </nav>
          </>
        )}
      </nav>

      
    </div>
  );
};

export default TimeMachine;
