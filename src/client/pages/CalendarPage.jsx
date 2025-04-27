import { useContext, useState, useEffect, useRef } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaArrowLeft, FaArrowRight, FaHome, FaSearch, FaSearchMinus, FaSearchPlus } from "react-icons/fa";

const CalendarPage = () => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const [calendarDate, setCalendarDate] = useState(currentDate);
  const [zoomLevel, setZoomLevel] = useState(1); // 0: year, 1: month, 2: week
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 992);
  const [hoveredDay, setHoveredDay] = useState(null);
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `button:hover {background-color: ${theme === 'dark' ? '#444444' : '#f0f0f0'} !important;}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme]);

  useEffect(() => {
    // Add window resize listener for responsive layout
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 576;
  
  // Helper functions
  const findMonthsDays = (year, month) => new Date(year, month + 1, 0).getDate();
  const findFirstDay = (year, month) => new Date(year, month, 0).getDay();
  const remapDay = day => day === 0 ? 6 : day - 1; // Convert Sunday(0) to 6, Monday(1) to 0
  
  // Date navigation functions
  const handleDateClick = (year, month, day) => setCalendarDate(new Date(year, month, day));
  
  const changeToPrevMonth = () => {
    // Always select the 1st day of the previous month
    const prevMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    setCalendarDate(prevMonth);
  };
  
  const changeToNextMonth = () => {
    // Always select the 1st day of the next month
    const nextMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    setCalendarDate(nextMonth);
  };
  
  const changeToPrevYear = () => 
    setCalendarDate(new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1));
  
  const changeToNextYear = () => 
    setCalendarDate(new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1));
  
  const changeToPrevWeek = () => 
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() - 7));
  
  const changeToNextWeek = () => 
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate() + 7));
  
  // Zoom control
  const decreaseZoomLevel = () => { if (zoomLevel > 0) setZoomLevel(zoomLevel - 1); };
  const increaseZoomLevel = () => { if (zoomLevel < 2) setZoomLevel(zoomLevel + 1); };
  
  // Format helpers
  const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
  // Get abbreviated month names for mobile view
  const getMonthName = (month) => {
    if (isMobile) {
      // Return abbreviated month names for mobile
      const abbr = months[month].substring(0, 3);
      return abbr;
    }
    return months[month];
  };
                
  const renderMonth = () => `${getMonthName(calendarDate.getMonth())} ${calendarDate.getFullYear()}`;
  const monthName = month => getMonthName(month);

  // Theme colors
  const darkBoxBg = '#2e2e2e'; 
  const lightBoxBg = '#ffffff';
  const darkSelectedBg = '#2a4d69'; 
  const lightSelectedBg = '#cce5ff';
  const darkTodayBg = '#1e3d58'; 
  const lightTodayBg = '#e6f7ff';
  const darkOtherMonthBg = '#202020'; 
  const lightOtherMonthBg = '#f9f9f9';
  const darkEmptyBg = '#2c2c2c'; 
  const lightEmptyBg = '#e0f0f0';
  const darkBorderColor = '#444444';
  const lightBorderColor = '#cccccc';
  const darkTextColor = '#e0e0e0';
  
  const getResponsiveStyles = () => {
    // Mobile styles
    if (windowWidth < 576) {
      return {
        calendarBox: {
          minHeight: "35px",
          fontSize: "12px",
          padding: "2px"
        },
        weekDay: {
          fontSize: "9px",
          padding: "2px"
        },
        button: {
          padding: "4px 6px",
          fontSize: "11px",
          marginBottom: "5px"
        },
        calendarContainer: {
          gap: "1px", 
          padding: "4px"
        },
        yearCalendar: {
          gridTemplateColumns: "repeat(3, 1fr)",
          fontSize: "12px"
        },
        monthName: {
          fontSize: "14px",
          marginBottom: "10px"
        },
        headerButton: {
          fontSize: "11px",
          padding: "4px 8px",
          width: "100%",
          maxWidth: "120px",
          margin: "5px auto",
          display: "block"
        }
      };
    }
    // Tablet styles  
    else if (windowWidth < 768) {
      return {
        calendarBox: {
          minHeight: "40px",
          fontSize: "13px",
          padding: "3px"
        },
        weekDay: {
          fontSize: "10px",
          padding: "3px"
        },
        button: {
          padding: "5px 8px",
          fontSize: "12px"
        },
        calendarContainer: {
          gap: "2px"
        },
        yearCalendar: {
          gridTemplateColumns: "repeat(4, 1fr)"
        },
        monthName: {
          fontSize: "16px"
        }
      };
    }
    // Default/desktop styles
    return {};
  };
  
  const responsiveStyles = getResponsiveStyles();
  
  const getBoxStyle = (date, isToday, isSelected, isOtherMonth = false) => {
    const baseStyle = isSelected 
      ? (zoomLevel === 2 ? styles.calendar_day_week_box_selected : styles.calendar_box_selected)
      : isToday
        ? (zoomLevel === 2 ? styles.calendar_day_week_box_today : styles.calendar_box_today)
        : isOtherMonth
          ? styles.calendar_day_week_box_other_month
          : (zoomLevel === 2 ? styles.calendar_day_week_box : styles.calendar_box);
    
    const bgColor = isSelected
      ? theme === 'dark' ? darkSelectedBg : lightSelectedBg
      : isToday
        ? theme === 'dark' ? darkTodayBg : lightTodayBg
        : isOtherMonth
          ? theme === 'dark' ? darkOtherMonthBg : lightOtherMonthBg
          : theme === 'dark' ? darkBoxBg : lightBoxBg;
      
    const borderColor = theme === 'dark' ? darkBorderColor : lightBorderColor;
    
    // Check if this day is currently being hovered
    const isHovered = hoveredDay && date && date.toDateString() === hoveredDay.toDateString();
    const hoverStyles = isHovered ? {
      backgroundColor: theme === 'dark' ? '#3a3a3a' : '#f0f0f0',
      transform: 'scale(1.05)',
      boxShadow: theme === 'dark' ? '0 0 5px rgba(255,255,255,0.1)' : '0 0 5px rgba(0,0,0,0.1)',
    } : {};
    
    return {
      ...baseStyle,
      backgroundColor: bgColor,
      borderColor: borderColor,
      color: theme === 'dark' ? (isOtherMonth ? '#a0a0a0' : darkTextColor) : 'inherit',
      ...(responsiveStyles.calendarBox || {}),
      ...hoverStyles
    };
  };
  
  // Calendar rendering functions
  const renderYearCalendar = () => {
    const year = calendarDate.getFullYear();
    return months.map((month, i) => {
      const dateSelected = new Date(year, i, calendarDate.getDate());
      const isSelected = calendarDate && calendarDate.toDateString() === dateSelected.toDateString();
      
      // Fixed: Use proper date comparison to check if this month contains today's date
      const isToday = currentDate.getMonth() === i && currentDate.getFullYear() === year;
      
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
  
  const renderMonthCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const totalDays = findMonthsDays(year, month);
    const firstDay = findFirstDay(year, month);
    let allDays = [];
    
    // Add weekday headers
    ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].forEach(day => {
      // Show abbreviated day names on small screens
      const displayDay = windowWidth < 576 ? day : (windowWidth < 768 ? day : day === "Lun" ? "Lunedì" : 
                         day === "Mar" ? "Martedì" : day === "Mer" ? "Mercoledì" : 
                         day === "Gio" ? "Giovedì" : day === "Ven" ? "Venerdì" : 
                         day === "Sab" ? "Sabato" : "Domenica");
      
      allDays.push(<div key={day} style={weekDayStyle}>{displayDay}</div>);
    });
    
    // Add empty days for start of month
    for (let i = 0; i < firstDay; i++) {
      allDays.push(
        <div key={`empty-${i}`} style={{
          ...styles.empty_calendar_box,
          backgroundColor: theme === 'dark' ? darkEmptyBg : lightEmptyBg,
        }}></div>
      );
    }
    
    // Add days of month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const isSelected = calendarDate && calendarDate.toDateString() === date.toDateString();
      const isToday = currentDate.toDateString() === date.toDateString();
      
      allDays.push(
        <div
          key={`day-${i}`}
          style={getBoxStyle(date, isToday, isSelected)}
          onClick={() => handleDateClick(year, month, i)}
          onMouseEnter={() => setHoveredDay(date)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {i}
        </div>
      );
    }
    
    return allDays;
  };
  
  const renderWeekCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    let daysLeft = 7;
    const totalDays = findMonthsDays(year, month);
    const firstDay = findFirstDay(year, month);
    let allDays = [];
    
    // Add weekday headers
    ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].forEach(day => {
      // Show abbreviated day names on small screens
      const displayDay = windowWidth < 576 ? day : (windowWidth < 768 ? day : day === "Lun" ? "Lunedì" : 
                         day === "Mar" ? "Martedì" : day === "Mer" ? "Mercoledì" : 
                         day === "Gio" ? "Giovedì" : day === "Ven" ? "Venerdì" : 
                         day === "Sab" ? "Sabato" : "Domenica");
      
      allDays.push(<div key={day} style={weekDayStyle}>{displayDay}</div>);
    });
      
    // Calculate first day of the displayed week
    let firstWeekDay = calendarDate.getDate() - remapDay(calendarDate.getDay());
    
    if (firstWeekDay < 1) {
      // Show days from previous month
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthDays = findMonthsDays(prevYear, prevMonth);
      
      // Add days from previous month
      for (let i = prevMonthDays + firstWeekDay; i <= prevMonthDays; i++) {
        const date = new Date(prevYear, prevMonth, i);
        const isSelected = calendarDate && calendarDate.toDateString() === date.toDateString();
        const isToday = currentDate.toDateString() === date.toDateString();
        
        allDays.push(
          <div
            key={`prev-${i}`}
            style={getBoxStyle(date, isToday, isSelected, true)}
            onClick={() => handleDateClick(prevYear, prevMonth, i)}
            onMouseEnter={() => setHoveredDay(date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {i}
          </div>
        );
        daysLeft--;
      }
      
      // Add beginning days of current month
      for (let i = 1; i <= daysLeft; i++) {
        const date = new Date(year, month, i);
        const isSelected = calendarDate && calendarDate.toDateString() === date.toDateString();
        const isToday = currentDate.toDateString() === date.toDateString();
        
        allDays.push(
          <div
            key={`day-${i}`}
            style={getBoxStyle(date, isToday, isSelected)}
            onClick={() => handleDateClick(year, month, i)}
            onMouseEnter={() => setHoveredDay(date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {i}
          </div>
        );
      }
    } else {
      // Show days within the current month or next month
      let dayCount = 1;
      
      // Add days from current month
      for (let i = firstWeekDay; dayCount <= 7 && i <= totalDays; i++) {
        const date = new Date(year, month, i);
        const isSelected = calendarDate && calendarDate.toDateString() === date.toDateString();
        const isToday = currentDate.toDateString() === date.toDateString();
        
        allDays.push(
          <div
            key={`day-${i}`}
            style={getBoxStyle(date, isToday, isSelected)}
            onClick={() => handleDateClick(year, month, i)}
            onMouseEnter={() => setHoveredDay(date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {i}
          </div>
        );
        dayCount++;
      }
      
      // Add days from next month if needed
      if (dayCount <= 7) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        
        for (let i = 1; dayCount <= 7; i++, dayCount++) {
          const date = new Date(nextYear, nextMonth, i);
          const isSelected = calendarDate && calendarDate.toDateString() === date.toDateString();
          const isToday = currentDate.toDateString() === date.toDateString();
          
          allDays.push(
            <div
              key={`next-${i}`}
              style={getBoxStyle(date, isToday, isSelected, true)}
              onClick={() => handleDateClick(nextYear, nextMonth, i)}
              onMouseEnter={() => setHoveredDay(date)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {i}
            </div>
          );
        }
      }
    }
    
    return allDays;
  };
  
  // Button style
  const btnStyle = {
    ...styles.button,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? darkTextColor : '#000',
    borderColor: theme === 'dark' ? darkBorderColor : lightBorderColor,
    ...(responsiveStyles.button || {})
  };
  
  // Back home button style
  const backHomeBtnStyle = {
    ...btnStyle,
    ...(responsiveStyles.headerButton || {})
  };
  
  // Disabled button style
  const disabledBtnStyle = {
    ...btnStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: theme === 'dark' ? '#282828' : '#e0e0e0',
  };
  
  // Calendar container style
  const yearCalendarStyle = {
    ...styles.year_calendar,
    ...(responsiveStyles.yearCalendar || {})
  };
  
  const calendarContainerStyle = {
    ...(zoomLevel === 0 
      ? yearCalendarStyle 
      : (zoomLevel === 1 ? styles.month_calendar : styles.week_calendar)),
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
    ...(responsiveStyles.calendarContainer || {})
  };
  
  // Common button container
  const ButtonContainer = ({ children }) => (
    <div style={styles.buttonContainer}>{children}</div>
  );

  // Update week_day style with responsive adjustment
  const weekDayStyle = {
    ...styles.week_day,
    ...(responsiveStyles.weekDay || {}),
    color: theme === 'dark' ? darkTextColor : '#333333'
  };
  
  // Month name style with responsive adjustment
  const monthNameStyle = {
    ...styles.month_name,
    ...(responsiveStyles.monthName || {}),
    color: theme === 'dark' ? darkTextColor : 'inherit'
  };
  
  return (
    <div>
      <div style={{
        ...styles.headerContainer,
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        <button
          style={{
            ...backHomeBtnStyle,
            ...(isButtonHovered ? styles.buttonHover : {})
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={() => window.location.href = "/"}
        >
          <FaArrowLeft /> Back to Home
        </button>
      </div>
      
      <div style={styles.titleContainer}>
        <h1 style={{ 
          color: theme === 'dark' ? darkTextColor : 'inherit',
          fontSize: isMobile ? '20px' : '24px'
        }}>Calendar</h1>
      </div>
      
      <div style={monthNameStyle}>
        {zoomLevel === 0 ? calendarDate.getFullYear() : renderMonth()}
      </div>
      
      <ButtonContainer>
        {zoomLevel === 0 && (
          <>
            <button style={btnStyle} onClick={changeToPrevYear}><FaArrowLeft /> {isMobile ? 'Prev Year' : 'Previous Year'}</button>
            <button style={btnStyle} onClick={changeToNextYear}>{isMobile ? 'Next Year' : 'Next Year'} <FaArrowRight /></button>
          </>
        )}
        
        {zoomLevel === 1 && (
          <>
            <button style={btnStyle} onClick={changeToPrevMonth}><FaArrowLeft /> {isMobile ? 'Prev Month' : 'Previous Month'}</button>
            <button style={btnStyle} onClick={changeToNextMonth}>{isMobile ? 'Next Month' : 'Next Month'} <FaArrowRight /></button>
          </>
        )}
        
        {zoomLevel === 2 && (
          <>
            <button style={btnStyle} onClick={changeToPrevWeek}><FaArrowLeft /> {isMobile ? 'Prev Week' : 'Previous Week'}</button>
            <button style={btnStyle} onClick={changeToNextWeek}>{isMobile ? 'Next Week' : 'Next Week'} <FaArrowRight /></button>
          </>
        )}
      </ButtonContainer>
      
      <div style={{
        ...styles.calendarOuterContainer,
        padding: isMobile ? '5px' : '10px',
      }}>
        <div style={calendarContainerStyle}>
          {zoomLevel === 0 && renderYearCalendar()}
          {zoomLevel === 1 && renderMonthCalendar()}
          {zoomLevel === 2 && renderWeekCalendar()}
        </div>
      </div>
      
      <ButtonContainer>
        <button 
          style={zoomLevel === 0 ? disabledBtnStyle : btnStyle} 
          onClick={decreaseZoomLevel} 
          disabled={zoomLevel === 0}
        >
          <FaSearchMinus /> {isMobile ? 'Decrease' : 'Decrease Zoom'}
        </button>
        <button 
          style={zoomLevel === 2 ? disabledBtnStyle : btnStyle} 
          onClick={increaseZoomLevel} 
          disabled={zoomLevel === 2}
        >
          <FaSearchPlus /> {isMobile ? 'Increase' : 'Increase Zoom'}
        </button>
      </ButtonContainer>
    </div>
  );
};

const styles = {
  month_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(7, auto)",
    gap: "5px",
    padding: "10px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto"
  },
  empty_calendar_box: {
    minHeight: "60px",
    borderRadius: "5px",
  },
  calendar_box: {
    border: "1px solid #cccccc",
    minHeight: "60px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s, border-color 0.3s",
  },
  calendar_box_selected: {
    border: "2px solid #003366",
    minHeight: "60px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transform: "scale(1.1)",
  },
  calendar_box_today: {
    border: "2px solid #0066cc",
    minHeight: "60px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transform: "scale(1.05)",
  },
  week_day: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "#333333",
    padding: "5px",
    fontSize: "14px",
  },
  month_name: {
    textAlign: "center",
    fontSize: "20px",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  year_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    padding: "10px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto"
  },
  week_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(2, auto)",
    gap: "5px",
    padding: "10px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto"
  },
  calendar_day_week_box: {
    border: "1px solid #cccccc",
    minHeight: "80px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s, border-color 0.3s",
  },
  calendar_day_week_box_other_month: {
    border: "1px solid #dddddd",
    minHeight: "80px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  calendar_day_week_box_selected: {
    border: "2px solid #003366",
    minHeight: "80px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transform: "scale(1.1)",
  },
  calendar_day_week_box_today: {
    border: "2px solid #0066cc",
    minHeight: "80px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transform: "scale(1.05)",
  },
  button: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    padding: "8px 15px",
    fontSize: "14px",
    cursor: "pointer",
    margin: "5px",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#f0f0f0",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
    margin: "10px 0",
  },
  title: {
    textAlign: "center",
    width: "100%",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    width: "100%",
    marginTop: "10px"
  },
  calendarOuterContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: "100%",
    overflow: "auto"
  },
  titleContainer: {
    textAlign: "center",
    width: "100%",
    marginBottom: "10px",
  }
};

export default CalendarPage;
