import { useContext, useState, useEffect, useRef } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import { ThemeContext } from "../contexts/ThemeContext";
import { CalendarViewModeContext } from "../contexts/CalendarViewModeContext.jsx";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaSearch,
  FaSearchMinus,
  FaSearchPlus,
  FaExclamationCircle,
} from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import BlurredWindow from "../components/BlurredWindow";
import commonStyles from "../styles/commonStyles";
import PageTransition from "../components/PageTransition";
import fetchAllEventsData from "../data_fetching/fetchAllEventsData.js";
import fetchAllActivitiesData from "../data_fetching/fetchAllActivitiesData.js";
import FormSelect from "../components/FormSelect.jsx";
import { NewEventForm, DisplayEvents } from "../components/Events.jsx";
import {
  NewActivityForm,
  DisplayActivities,
  ActivitiesSummary,
} from "../components/Activities.jsx";

const CalendarPage = () => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { calendarViewMode, setCalendarViewMode } = useContext(
    CalendarViewModeContext,
  );

  const [calendarDate, setCalendarDate] = useState(currentDate);
  const [zoomLevel, setZoomLevel] = useState(1); // 0 year, 1 month, 2 week
  const [eventCreateHovered, setEventCreateHovered] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 992,
  );
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [newEventCreateDate, setNewEventCreateDate] = useState(null);

  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [newActivityCreateDate, setNewActivityCreateDate] = useState(null);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [allActivities, setAllActivities] = useState([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `.global-hover:hover {background-color: ${theme === "dark" ? "#444444" : "#f0f0f0"} !important;}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

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

  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const { data: eventsData, refetch: refetchEvents } = useQuery(
    ["userEvents", currentUser],
    () => fetchAllEventsData({ userID: currentUser }),
    { enabled: !!currentUser, refetchOnMount: true, staleTime: 0 },
  );

  const { data: activitiesData, refetch: refetchActivities } = useQuery(
    ["userActivities", currentUser],
    () => fetchAllActivitiesData({ userID: currentUser }),
    { enabled: !!currentUser, refetchOnMount: true, staleTime: 0 },
  );

  useEffect(() => {
    refetchEvents();
    refetchActivities();
  }, []);

  useEffect(() => {
    if (eventsData) {
      setAllEvents(eventsData.data);
    }
  }, [eventsData]);

  useEffect(() => {
    if (activitiesData) {
      setAllActivities(activitiesData.data);
    }
  }, [activitiesData]);

  // days in month
  const findMonthsDays = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  // first day of month (0-6)
  const findFirstDay = (year, month) => new Date(year, month, 0).getDay();
  // make monday = 0
  const remapDay = (day) => (day === 0 ? 6 : day - 1);
  // pick date
  const handleDateClick = (year, month, day) => {
    const newDate = new Date(year, month, day);
    setCalendarDate(newDate);
    if (
      selectedDate &&
      selectedDate.toDateString() === newDate.toDateString()
    ) {
      setSelectedDate(null);
    } else {
      setSelectedDate(newDate);
    }
  };
  // prev month
  const changeToPrevMonth = () => {
    const prevMonth = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() - 1,
      1,
    );
    setCalendarDate(prevMonth);
  };
  // next month
  const changeToNextMonth = () => {
    const nextMonth = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + 1,
      1,
    );
    setCalendarDate(nextMonth);
  };
  // prev year
  const changeToPrevYear = () =>
    setCalendarDate(
      new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1),
    );
  // next year
  const changeToNextYear = () =>
    setCalendarDate(
      new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1),
    );
  // prev week
  const changeToPrevWeek = () =>
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() - 7,
      ),
    );
  // next week
  const changeToNextWeek = () =>
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() + 7,
      ),
    );
  // zoom -
  const decreaseZoomLevel = () => {
    if (zoomLevel > 0) setZoomLevel(zoomLevel - 1);
  };
  // zoom +
  const increaseZoomLevel = () => {
    if (zoomLevel < 2) setZoomLevel(zoomLevel + 1);
  };

  // Format helpers
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // month name
  const getMonthName = (month) => {
    if (isMobile) {
      const abbr = months[month].substring(0, 3);
      return abbr;
    }
    return months[month];
  };
  // month header
  const renderMonth = () =>
    `${getMonthName(calendarDate.getMonth())} ${calendarDate.getFullYear()}`;
  const monthName = (month) => getMonthName(month);

  // theme colors
  const calendarColors = commonStyles.calendar.colors;
  const themeColors =
    theme === "dark" ? calendarColors.dark : calendarColors.light;
  // responsive tweaks
  const responsiveStyles =
    commonStyles.getResponsiveStyles(windowWidth).calendar || {};

  const getBoxStyle = (date, isToday, isSelected, isOtherMonth = false) => {
    isSelected =
      selectedDate &&
      date &&
      date.toDateString() === selectedDate.toDateString();

  // box base
  const baseBoxStyle = {
      ...commonStyles.calendar.box.base(isMobile),
      ...(zoomLevel === 2 ? { minHeight: isMobile ? "50px" : "80px" } : {}),
    };
  // box state styles
  const boxStyle = {
      ...baseBoxStyle,
      ...(isSelected && {
        ...commonStyles.calendar.box.selected,
        backgroundColor: themeColors.selectedBg,
        borderColor: theme === "dark" ? "#ffffff" : "#003366",
      }),
      ...(isToday &&
        !isSelected && {
          ...commonStyles.calendar.box.today,
          backgroundColor: themeColors.todayBg,
          borderColor: "#0066cc",
        }),
      ...(!isToday &&
        !isSelected && {
          backgroundColor: isOtherMonth
            ? theme === "dark"
              ? "rgba(20, 20, 20, 0.7)"
              : themeColors.otherMonthBg
            : theme === "dark"
              ? "rgba(20, 20, 30, 0.7)"
              : themeColors.boxBg,
          borderColor:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : themeColors.borderColor,
        }),
      ...(isOtherMonth &&
        !isSelected &&
        !isToday && {
          ...commonStyles.calendar.box.otherMonth,
        }),
      ...(responsiveStyles.box || {}),
      ...(theme === "dark" && {
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }),
    };
  // hover check
  const isHovered =
      hoveredDay && date && date.toDateString() === hoveredDay.toDateString();
    const hoverStyles = isHovered
      ? {
          backgroundColor:
            theme === "dark" ? "rgba(40, 40, 50, 0.8)" : "#f0f0f0",
          transform: isMobile ? "scale(1.02)" : "scale(1.05)",
          boxShadow:
            theme === "dark"
              ? "0 0 5px rgba(255,255,255,0.1)"
              : "0 0 5px rgba(0,0,0,0.1)",
        }
      : {};

    return {
      ...boxStyle,
      color:
        theme === "dark"
          ? isOtherMonth
            ? "#a0a0a0"
            : themeColors.textColor
          : "inherit",
      ...hoverStyles,
    };
  };

  const RenderCalendarEventsAndActivities = (props) => {
    const { i, date } = props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          data-stop-calendar-click
          style={commonStyles.calendar.events.buttonEventCreate(
            eventCreateHovered === i,
          )}
          onMouseEnter={() => setEventCreateHovered(i)}
          onMouseLeave={() => setEventCreateHovered(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (calendarViewMode === "events") {
              setShowNewEventForm(true);
              setNewEventCreateDate(date);
            } else {
              setShowNewActivityForm(true);
              setNewActivityCreateDate(date);
            }
          }}
        >
          <IconContext.Provider
            value={{
              color: theme === "dark" ? "white" : "black",
              size: isMobile ? "15px" : "20px",
            }}
          >
            <FaCirclePlus />
          </IconContext.Provider>
        </button>
        {calendarViewMode === "events" ? (
          <DisplayEvents
            data-stop-calendar-click
            allEvents={allEvents}
            date={date}
            isMobile={isMobile}
            remapDay={remapDay}
            error={error}
            setError={setError}
          />
        ) : (
          <DisplayActivities
            data-stop-calendar-click
            allActivities={allActivities}
            date={date}
            isMobile={isMobile}
            remapDay={remapDay}
          />
        )}
      </div>
    );
  };

  // year view
  const renderYearCalendar = () => {
    const year = calendarDate.getFullYear();
    return months.map((month, i) => {
      const dateSelected = new Date(year, i, 1);

      const isSelected =
        selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === i;

      const isToday =
        currentDate.getMonth() === i && currentDate.getFullYear() === year;

      return (
        <div key={`month-${i}`}>
          <div
            style={getBoxStyle(dateSelected, isToday, isSelected)}
            onClick={() => handleDateClick(year, i, 1)}
            onMouseEnter={() => setHoveredDay(new Date(year, i, 1))}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {monthName(i)}
          </div>
        </div>
      );
    });
  };

  // month view
  const renderMonthCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const totalDays = findMonthsDays(year, month);
    const firstDay = findFirstDay(year, month);
    let allDays = [];

  // week days
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day) => {
      const displayDay =
        windowWidth < 576
          ? day.charAt(0)
          : windowWidth < 768
            ? day
            : day === "Mon"
              ? "Monday"
              : day === "Tue"
                ? "Tuesday"
                : day === "Wed"
                  ? "Wednesday"
                  : day === "Thu"
                    ? "Thursday"
                    : day === "Fri"
                      ? "Friday"
                      : day === "Sat"
                        ? "Saturday"
                        : "Sunday";

      allDays.push(
        <div key={day} style={weekDayStyle}>
          {displayDay}
        </div>,
      );
    });
  // leading blanks
  for (let i = 0; i < firstDay; i++) {
      allDays.push(
        <div
          key={`empty-${i}`}
          style={{
            ...commonStyles.calendar.box.base(isMobile),
            backgroundColor: themeColors.emptyBg,
            minHeight: isMobile ? "35px" : "60px",
            borderRadius: "5px",
            ...(responsiveStyles.box || {}),
          }}
        ></div>,
      );
    }
  // days
  for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);

      const isToday =
        currentDate.getDate() === i &&
        currentDate.getMonth() === month &&
        currentDate.getFullYear() === year;

      allDays.push(
        <div
          key={`day-${i}`}
          style={getBoxStyle(date, isToday, false)}
          onClick={(e) => {
            if (e.target.closest("[data-stop-calendar-click]")) return;
            handleDateClick(year, month, i);
          }}
          onMouseEnter={() => setHoveredDay(date)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {i}
          <RenderCalendarEventsAndActivities i={i} date={date} />
        </div>,
      );
    }

    return allDays;
  };
  // week view
  const renderWeekCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    let daysLeft = 7;
    const totalDays = findMonthsDays(year, month);
    const firstDay = findFirstDay(year, month);
    let allDays = [];

  // week days
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day) => {
      const displayDay =
        windowWidth < 576
          ? day.charAt(0)
          : windowWidth < 768
            ? day
            : day === "Mon"
              ? "Monday"
              : day === "Tue"
                ? "Tuesday"
                : day === "Wed"
                  ? "Wednesday"
                  : day === "Thu"
                    ? "Thursday"
                    : day === "Fri"
                      ? "Friday"
                      : day === "Sat"
                        ? "Saturday"
                        : "Sunday";

      allDays.push(
        <div key={day} style={weekDayStyle}>
          {displayDay}
        </div>,
      );
    });
  // start of week
  let firstWeekDay = calendarDate.getDate() - remapDay(calendarDate.getDay());
  if (firstWeekDay < 1) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthDays = findMonthsDays(prevYear, prevMonth);
  // prev month tail
  for (let i = prevMonthDays + firstWeekDay; i <= prevMonthDays; i++) {
        const date = new Date(prevYear, prevMonth, i);

        const isToday =
          currentDate.getDate() === i &&
          currentDate.getMonth() === prevMonth &&
          currentDate.getFullYear() === prevYear;

        allDays.push(
          <div
            key={`prev-${i}`}
            style={getBoxStyle(date, isToday, false, true)}
            onClick={() => handleDateClick(prevYear, prevMonth, i)}
            onMouseEnter={() => setHoveredDay(date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {i}
            <RenderCalendarEventsAndActivities i={i} date={date} />
          </div>,
        );
        daysLeft--;
      }
  // current month head
  for (let i = 1; i <= daysLeft; i++) {
        const date = new Date(year, month, i);

        const isToday =
          currentDate.getDate() === i &&
          currentDate.getMonth() === month &&
          currentDate.getFullYear() === year;

        allDays.push(
          <div
            key={`day-${i}`}
            style={getBoxStyle(date, isToday, false)}
            onClick={(e) => {
              if (e.target.closest("[data-stop-calendar-click]")) return;
              handleDateClick(year, month, i);
            }}
            onMouseEnter={() => setHoveredDay(date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {i}
            <RenderCalendarEventsAndActivities i={i} date={date} />
          </div>,
        );
      }
    } else {
  let dayCount = 1;
  // fill this week
  for (let i = firstWeekDay; dayCount <= 7 && i <= totalDays; i++) {
        const date = new Date(year, month, i);

        const isToday =
          currentDate.getDate() === i &&
          currentDate.getMonth() === month &&
          currentDate.getFullYear() === year;

        allDays.push(
          <div
            key={`day-${i}`}
            style={getBoxStyle(date, isToday, false)}
            onClick={() => handleDateClick(year, month, i)}
            onMouseEnter={() => setHoveredDay(date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {i}
            <RenderCalendarEventsAndActivities i={i} date={date} />
          </div>,
        );
        dayCount++;
      }
  // spill into next month
  if (dayCount <= 7) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;

        for (let i = 1; dayCount <= 7; i++, dayCount++) {
          const date = new Date(nextYear, nextMonth, i);

          const isToday =
            currentDate.getDate() === i &&
            currentDate.getMonth() === nextMonth &&
            currentDate.getFullYear() === nextYear;

          allDays.push(
            <div
              key={`next-${i}`}
              style={getBoxStyle(date, isToday, false, true)}
              onClick={() => handleDateClick(nextYear, nextMonth, i)}
              onMouseEnter={() => setHoveredDay(date)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {i}
              <RenderCalendarEventsAndActivities i={i} date={date} />
            </div>,
          );
        }
      }
    }

    return allDays;
  };
  // nav button style
  const getButtonStyle = (buttonId) => {
    const isHovered = hoveredButton === buttonId;
    const isDisabled =
      (buttonId === "decreaseZoom" && zoomLevel === 0) ||
      (buttonId === "increaseZoom" && zoomLevel === 2);

    const baseStyle = commonStyles.calendar.button(
      theme,
      isHovered,
      isDisabled,
    );
    if (isMobile) {
      return {
        ...baseStyle,
        padding: "4px 8px",
        fontSize: "12px",
        minWidth: "auto",
      };
    }
    return baseStyle;
  };
  // grid style
  const calendarContainerStyle = {
    ...(zoomLevel === 0
      ? commonStyles.calendar.container.year
      : zoomLevel === 1
        ? commonStyles.calendar.container.month
        : commonStyles.calendar.container.week),
    ...commonStyles.blurredBackdrop(theme),
    ...(responsiveStyles.container || {}),
    ...(zoomLevel === 0 && responsiveStyles.yearGrid
      ? { gridTemplateColumns: responsiveStyles.yearGrid.gridTemplateColumns }
      : {}),
    gap: isMobile ? "1px" : "5px",
  };
  // button row
  const ButtonContainer = ({ children }) => (
    <div
      style={{
        ...commonStyles.calendar.buttonContainer,
        flexWrap: "wrap",
        justifyContent: "center",
        gap: isMobile ? "5px" : "10px",
      }}
    >
      {children}
    </div>
  );
  // week day header
  const weekDayStyle = {
    ...commonStyles.calendar.header.weekDay,
    ...(responsiveStyles.weekDay || {}),
    color: theme === "dark" ? themeColors.textColor : "#333333",
    padding: isMobile ? "2px" : "5px",
    fontSize: isMobile ? "10px" : "14px",
  };
  // month label
  const monthNameStyle = {
    ...commonStyles.calendar.header.monthName,
    ...(responsiveStyles.monthName || {}),
    color: theme === "dark" ? themeColors.textColor : "inherit",
    fontSize: isMobile ? "16px" : "20px",
  };

  return (
    <PageTransition>
      <div>
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
              Calendar
            </h1>
          </div>

          <div style={{ margin: "10px 0", textAlign: "center" }}>
            <FormSelect
              value={calendarViewMode}
              onChange={(e) => setCalendarViewMode(e.target.value)}
            >
              <option value="events">Events</option>
              <option value="activities">Activities</option>
            </FormSelect>
          </div>

          <div style={monthNameStyle}>
            {zoomLevel === 0 ? calendarDate.getFullYear() : renderMonth()}
          </div>

          {(!showNewEventForm || !showNewActivityForm) && (
            <div
              style={commonStyles.getBannerStyle(
                "errorBannerStyle",
                showErrorBanner,
                theme,
              )}
            >
              <FaExclamationCircle style={commonStyles.bannerIconStyle} />
              <span>{error}</span>
            </div>
          )}

          {calendarViewMode === "events" ? (
            <NewEventForm
              showForm={showNewEventForm}
              setShowForm={setShowNewEventForm}
              refetchAllEventsData={refetchEvents}
              date={newEventCreateDate}
              setShowErrorBanner={setShowErrorBanner}
              showErrorBanner={showErrorBanner}
              setError={setError}
              error={error}
            />
          ) : (
            <NewActivityForm
              showForm={showNewActivityForm}
              setShowForm={setShowNewActivityForm}
              refetchAllActivitiesData={refetchActivities}
              endDate={newActivityCreateDate}
              setShowErrorBanner={setShowErrorBanner}
              showErrorBanner={showErrorBanner}
              setError={setError}
              error={error}
            />
          )}

          <ButtonContainer>
            {zoomLevel === 0 && (
              <>
                <button
                  className="global-hover"
                  style={getButtonStyle("prevYear")}
                  onClick={changeToPrevYear}
                  onMouseEnter={() => setHoveredButton("prevYear")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <FaArrowLeft /> {isMobile ? "Prev" : "Previous Year"}
                </button>
                <button
                  className="global-hover"
                  style={getButtonStyle("nextYear")}
                  onClick={changeToNextYear}
                  onMouseEnter={() => setHoveredButton("nextYear")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {isMobile ? "Next" : "Next Year"} <FaArrowRight />
                </button>
              </>
            )}

            {zoomLevel === 1 && (
              <>
                <button
                  style={getButtonStyle("prevMonth")}
                  onClick={changeToPrevMonth}
                  onMouseEnter={() => setHoveredButton("prevMonth")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <FaArrowLeft /> {isMobile ? "Prev" : "Previous Month"}
                </button>
                <button
                  style={getButtonStyle("nextMonth")}
                  onClick={changeToNextMonth}
                  onMouseEnter={() => setHoveredButton("nextMonth")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {isMobile ? "Next" : "Next Month"} <FaArrowRight />
                </button>
              </>
            )}

            {zoomLevel === 2 && (
              <>
                <button
                  className="global-hover"
                  style={getButtonStyle("prevWeek")}
                  onClick={changeToPrevWeek}
                  onMouseEnter={() => setHoveredButton("prevWeek")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <FaArrowLeft /> {isMobile ? "Prev" : "Previous Week"}
                </button>
                <button
                  className="global-hover"
                  style={getButtonStyle("nextWeek")}
                  onClick={changeToNextWeek}
                  onMouseEnter={() => setHoveredButton("nextWeek")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {isMobile ? "Next" : "Next Week"} <FaArrowRight />
                </button>
              </>
            )}
          </ButtonContainer>

          <ButtonContainer>
            <button
              className="global-hover"
              style={getButtonStyle("decreaseZoom")}
              onClick={decreaseZoomLevel}
              disabled={zoomLevel === 0}
              onMouseEnter={() => setHoveredButton("decreaseZoom")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <FaSearchMinus /> {isMobile ? "Zoom -" : "Decrease Zoom"}
            </button>
            <button
              className="global-hover"
              style={getButtonStyle("increaseZoom")}
              onClick={increaseZoomLevel}
              disabled={zoomLevel === 2}
              onMouseEnter={() => setHoveredButton("increaseZoom")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <FaSearchPlus /> {isMobile ? "Zoom +" : "Increase Zoom"}
            </button>
          </ButtonContainer>

          <div
            style={{
              ...commonStyles.calendar.container.outer,
              padding: isMobile ? "2px" : "10px",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div style={calendarContainerStyle}>
              {zoomLevel === 0 && renderYearCalendar()}
              {zoomLevel === 1 && renderMonthCalendar()}
              {zoomLevel === 2 && renderWeekCalendar()}
            </div>
          </div>

          {calendarViewMode === "activities" && (
            <div
              style={{
                width: "100%",
                display: allActivities.length ? "block" : "none",
              }}
            >
              <ActivitiesSummary
                activities={allActivities}
                refetchAllActivitiesData={refetchActivities}
                isMobile={isMobile}
                setError={setError}
                setShowErrorBanner={setShowErrorBanner}
              />
            </div>
          )}
        </BlurredWindow>
      </div>
    </PageTransition>
  );
};

export default CalendarPage;
