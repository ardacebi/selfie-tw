import { useContext } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";

const TimeMachine = () => {
  const { currentDate, setCurrentDate, manualControl, setManualControl } =
    useContext(CurrentDateContext);

  const handleManualControlToggle = () => {
    setManualControl((prev) => !prev);
  };
  const handleMoreHour = () => {
    const newDate = new Date(currentDate);
    newDate.setHours(newDate.getHours() + 1);
    setCurrentDate(newDate);
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 15px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <h2>Time Machine</h2>
      <p>Current Date: {currentDate.toString()}</p>
      <button onClick={handleManualControlToggle}>
        {manualControl ? "Stop Manual Control" : "Start Manual Control"}
      </button>
      <button onClick={handleMoreHour}>More hour</button>
    </nav>
  );
};

export default TimeMachine;
