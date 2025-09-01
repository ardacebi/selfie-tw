import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import BlurredWindow from "../components/BlurredWindow";
import PageTransition from "../components/PageTransition";
import commonStyles from "../styles/commonStyles";
import { FaPlay, FaPause, FaStop, FaRedo, FaCog } from "react-icons/fa";
import { IconContext } from "react-icons";

const PomodoroPage = () => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const [isMobile, setIsMobile] = useState(false);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("work");
  const [sessionCount, setSessionCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);

  const intervalRef = useRef(null);

  const STORAGE_KEY = "pomodoro_timer_state";

  useEffect(() => {
    const f = () => setIsMobile(window.innerWidth <= 768);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);

        if (state.isRunning && state.endTime) {
          const now = currentDate.getTime();
          const remainingMs = state.endTime - now;
          const newTimeLeft = Math.max(0, Math.ceil(remainingMs / 1000));

          if (newTimeLeft > 0) {
            setTimeLeft(newTimeLeft);
            setIsRunning(true);
            setSessionType(state.sessionType);
            setSessionCount(state.sessionCount);
            setStartTime(state.startTime);
            setEndTime(state.endTime);
          } else {
            setIsRunning(false);
            setEndTime(null);

            if (state.sessionType === "work") {
              const newCount = state.sessionCount + 1;
              setSessionCount(newCount);

              const isLongBreak = newCount % longBreakInterval === 0;
              const breakDuration = isLongBreak
                ? longBreakDuration
                : shortBreakDuration;

              setSessionType("break");
              setTimeLeft(breakDuration * 60);
            } else {
              setSessionType("work");
              setTimeLeft(workDuration * 60);
              setSessionCount(state.sessionCount);
            }
            setStartTime(null);
          }
        } else {
          setTimeLeft(state.timeLeft || 25 * 60);
          setIsRunning(false);
          setSessionType(state.sessionType || "work");
          setSessionCount(state.sessionCount || 0);
        }

        if (state.settings) {
          setWorkDuration(state.settings.workDuration || 25);
          setShortBreakDuration(state.settings.shortBreakDuration || 5);
          setLongBreakDuration(state.settings.longBreakDuration || 15);
          setLongBreakInterval(state.settings.longBreakInterval || 4);
        }
      } catch (error) {
        console.error("Error loading pomodoro state:", error);
      }
    }
  }, []);

  useEffect(() => {
    const state = {
      timeLeft,
      isRunning,
      sessionType,
      sessionCount,
      startTime,
      endTime,
      settings: {
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakInterval,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    timeLeft,
    isRunning,
    sessionType,
    sessionCount,
    startTime,
    endTime,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
  ]);

  useEffect(() => {
    if (isRunning && endTime) {
      const now = currentDate.getTime();
      const remainingMs = endTime - now;
      const newTimeLeft = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        setIsRunning(false);
        handleSessionComplete();
      }
    }
  }, [currentDate, isRunning, endTime]);

  const handleSessionComplete = () => {
    playNotificationSound();

    if (sessionType === "work") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);

      const isLongBreak = newCount % longBreakInterval === 0;
      const breakDuration = isLongBreak
        ? longBreakDuration
        : shortBreakDuration;

      setSessionType("break");
      setTimeLeft(breakDuration * 60);
    } else {
      setSessionType("work");
      setTimeLeft(workDuration * 60);
    }

    setStartTime(null);
    setEndTime(null);
  };

  const playNotificationSound = () => {
    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = sessionType === "work" ? 800 : 600;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const startTimer = () => {
    const now = currentDate.getTime();
    const sessionEndTime = now + timeLeft * 1000;

    setIsRunning(true);
    setStartTime(now - (getDurationInSeconds() - timeLeft) * 1000);
    setEndTime(sessionEndTime);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setEndTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDurationInSeconds());
    setStartTime(null);
    setEndTime(null);
  };

  const resetAllStats = () => {
    setIsRunning(false);
    setStartTime(null);
    setEndTime(null);

    setSessionType("work");
    setTimeLeft(workDuration * 60);

    setSessionCount(0);

    localStorage.removeItem(STORAGE_KEY);
  };

  const skipSession = () => {
    setIsRunning(false);
    setEndTime(null);
    handleSessionComplete();
  };

  const getDurationInSeconds = () => {
    if (sessionType === "work") {
      return workDuration * 60;
    } else {
      const isLongBreak = sessionCount % longBreakInterval === 0;
      return (isLongBreak ? longBreakDuration : shortBreakDuration) * 60;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    const total = getDurationInSeconds();
    return ((total - timeLeft) / total) * 100;
  };

  const getSessionTypeDisplay = () => {
    if (sessionType === "work") {
      return "Study Session";
    } else {
      const isLongBreak = sessionCount % longBreakInterval === 0;
      return isLongBreak ? "Long Break" : "Short Break";
    }
  };

  const [hoveredBtn, setHoveredBtn] = useState(null);
  const btn = (id, disabled = false) => {
    const base = commonStyles.calendar.button(
      theme,
      hoveredBtn === id,
      disabled,
    );
    return isMobile
      ? { ...base, padding: "6px 10px", fontSize: "12px", minWidth: "auto" }
      : base;
  };

  return (
    <PageTransition>
      <div style={{ color: theme === "dark" ? "white" : "black" }}>
        <BlurredWindow
          width={isMobile ? "95%" : "850px"}
          padding={isMobile ? "10px" : "20px"}
        >
          <div style={commonStyles.calendar.header.title}>
            <h1
              style={{
                ...commonStyles.welcomeGradient(theme),
                fontSize: isMobile ? "24px" : "32px",
              }}
              key={theme}
            >
              Pomodoro
            </h1>
          </div>

          {/* settings */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={btn("settings")}
              onMouseEnter={() => setHoveredBtn("settings")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <IconContext.Provider
                value={{ size: isMobile ? "14px" : "16px" }}
              >
                <FaCog />
              </IconContext.Provider>
              {!isMobile && " Settings"}
            </button>
          </div>
          {/* settings panel */}
          {showSettings && (
            <div
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(45, 55, 72, 0.8)"
                    : "rgba(237, 242, 247, 0.8)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px",
                border:
                  theme === "dark"
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  fontSize: isMobile ? "16px" : "18px",
                }}
              >
                Timer Settings
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: "15px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Work Duration (minutes):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={workDuration}
                    onChange={(e) =>
                      setWorkDuration(parseInt(e.target.value) || 1)
                    }
                    disabled={isRunning}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border:
                        theme === "dark"
                          ? "1px solid #4a5568"
                          : "1px solid #e2e8f0",
                      backgroundColor: theme === "dark" ? "#2d3748" : "white",
                      color: theme === "dark" ? "white" : "black",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Short Break (minutes):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreakDuration}
                    onChange={(e) =>
                      setShortBreakDuration(parseInt(e.target.value) || 1)
                    }
                    disabled={isRunning}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border:
                        theme === "dark"
                          ? "1px solid #4a5568"
                          : "1px solid #e2e8f0",
                      backgroundColor: theme === "dark" ? "#2d3748" : "white",
                      color: theme === "dark" ? "white" : "black",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Long Break (minutes):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakDuration}
                    onChange={(e) =>
                      setLongBreakDuration(parseInt(e.target.value) || 1)
                    }
                    disabled={isRunning}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border:
                        theme === "dark"
                          ? "1px solid #4a5568"
                          : "1px solid #e2e8f0",
                      backgroundColor: theme === "dark" ? "#2d3748" : "white",
                      color: theme === "dark" ? "white" : "black",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Long Break Every (sessions):
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={longBreakInterval}
                    onChange={(e) =>
                      setLongBreakInterval(parseInt(e.target.value) || 2)
                    }
                    disabled={isRunning}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border:
                        theme === "dark"
                          ? "1px solid #4a5568"
                          : "1px solid #e2e8f0",
                      backgroundColor: theme === "dark" ? "#2d3748" : "white",
                      color: theme === "dark" ? "white" : "black",
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button
                  onClick={() => {
                    if (!isRunning) {
                      setTimeLeft(
                        sessionType === "work"
                          ? workDuration * 60
                          : (sessionCount % longBreakInterval === 0
                              ? longBreakDuration
                              : shortBreakDuration) * 60,
                      );
                    }
                  }}
                  disabled={isRunning}
                  style={btn("apply", isRunning)}
                  onMouseEnter={() => setHoveredBtn("apply")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  Apply Settings
                </button>
              </div>
            </div>
          )}
          {/* session info */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "18px" : "24px",
                marginBottom: "10px",
                color: theme === "dark" ? "#e2e8f0" : "#2d3748",
              }}
            >
              {getSessionTypeDisplay()}
            </h2>
            <p
              style={{
                fontSize: isMobile ? "14px" : "16px",
                opacity: 0.8,
                marginBottom: "5px",
              }}
            >
              Session {sessionCount + 1} • Completed: {sessionCount}
            </p>
            {startTime && (
              <p
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  opacity: 0.6,
                }}
              >
                Started: {new Date(startTime).toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* pomodoro timer */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: isMobile ? "200px" : "250px",
                height: isMobile ? "200px" : "250px",
              }}
            >
              <svg
                width="100%"
                height="100%"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={theme === "dark" ? "#4a5568" : "#e2e8f0"}
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={theme === "dark" ? "#718096" : "#4a5568"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}%`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}%`}
                  style={{
                    transition: "stroke-dashoffset 1s ease-in-out",
                  }}
                />
              </svg>

              {/* timer display */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "32px" : "48px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    // use app font
                  }}
                >
                  {formatTime(timeLeft)}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    opacity: 0.7,
                  }}
                >
                  {Math.round(getProgress())}% Complete
                </div>
              </div>
            </div>
          </div>
          {/* controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <IconContext.Provider
              value={{
                size: isMobile ? "16px" : "18px",
                style: { marginRight: isMobile ? "0px" : "8px" },
              }}
            >
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  style={btn("start", timeLeft === 0)}
                  onMouseEnter={() => setHoveredBtn("start")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  disabled={timeLeft === 0}
                >
                  <FaPlay />
                  {!isMobile && " Start"}
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  style={btn("pause")}
                  onMouseEnter={() => setHoveredBtn("pause")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <FaPause />
                  {!isMobile && " Pause"}
                </button>
              )}

              <button
                onClick={resetAllStats}
                style={btn("reset")}
                onMouseEnter={() => setHoveredBtn("reset")}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <FaRedo />
                {!isMobile && " Reset"}
              </button>

              <button
                onClick={skipSession}
                style={btn("skip", timeLeft === 0)}
                onMouseEnter={() => setHoveredBtn("skip")}
                onMouseLeave={() => setHoveredBtn(null)}
                disabled={timeLeft === 0}
              >
                <FaStop />
                {!isMobile && " Skip"}
              </button>
            </IconContext.Provider>
          </div>
          {/* stats */}
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              backgroundColor:
                theme === "dark"
                  ? "rgba(45, 55, 72, 0.3)"
                  : "rgba(237, 242, 247, 0.3)",
              borderRadius: "12px",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            <p style={{ marginBottom: "10px" }}>
              <strong>Today's Progress:</strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "15px",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    fontWeight: "bold",
                  }}
                >
                  {sessionCount}
                </div>
                <div
                  style={{ opacity: 0.7, fontSize: isMobile ? "12px" : "14px" }}
                >
                  Completed Sessions
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor((sessionCount * workDuration) / 60)}h{" "}
                  {(sessionCount * workDuration) % 60}m
                </div>
                <div
                  style={{ opacity: 0.7, fontSize: isMobile ? "12px" : "14px" }}
                >
                  Study Time
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    fontWeight: "bold",
                  }}
                >
                  {sessionType === "work" ? "Working" : "Break"}
                </div>
                <div
                  style={{ opacity: 0.7, fontSize: isMobile ? "12px" : "14px" }}
                >
                  Current Status
                </div>
              </div>
            </div>
          </div>
        </BlurredWindow>
      </div>
    </PageTransition>
  );
};

export default PomodoroPage;
