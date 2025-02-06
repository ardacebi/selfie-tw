import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";

const CalendarPage = () => {
  const { currentDate } = useContext(CurrentDateContext);
  const [calendarDate, setCalendarDate] = useState(currentDate);
  const [selectZoomLevel, setSelectZoomLevel] = useState(1);

  const findMonthsDays = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const findFirstDay = (year, month) => {
    return new Date(year, month, 0).getDay();
  };

  const handleDateClick = (year, month, day) => {
    setCalendarDate(new Date(year, month, day));
    console.log("You clicked on day: ", day);
  };

  const changeToPrevMonth = () => {
    const prevMonthDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() - 1,
    );
    if (
      findMonthsDays(prevMonthDate.getFullYear(), prevMonthDate.getMonth()) <
      calendarDate.getDate()
    ) {
      setCalendarDate(prevMonthDate);
    } else {
      setCalendarDate(
        new Date(
          prevMonthDate.getFullYear(),
          prevMonthDate.getMonth(),
          calendarDate.getDate(),
        ),
      );
    }
  };

  const changeToNextMonth = () => {
    const nextMonthDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + 1,
    );
    if (
      findMonthsDays(nextMonthDate.getFullYear(), nextMonthDate.getMonth()) <
      calendarDate.getDate()
    ) {
      setCalendarDate(nextMonthDate);
    } else {
      setCalendarDate(
        new Date(
          nextMonthDate.getFullYear(),
          nextMonthDate.getMonth(),
          calendarDate.getDate(),
        ),
      );
    }
  };

  const changeToPrevYear = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear() - 1,
        calendarDate.getMonth(),
        calendarDate.getDate(),
      ),
    );
  };

  const changeToNextYear = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear() + 1,
        calendarDate.getMonth(),
        calendarDate.getDate(),
      ),
    );
  };

  const changeToPrevWeek = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() - 7,
      ),
    );
  };

  const changeToNextWeek = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() + 7,
      ),
    );
  };

  const decreaseZoomLevel = () => {
    if (selectZoomLevel > 0) setSelectZoomLevel(selectZoomLevel - 1);
  };

  const increaseZoomLevel = () => {
    if (selectZoomLevel < 2) setSelectZoomLevel(selectZoomLevel + 1);
  };

  const renderMonth = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];
    return `${months[currentMonth]} ${currentYear}`;
  };

  const renderMonthCalendar = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    const monthsTotalDays = findMonthsDays(currentYear, currentMonth);
    const firstDay = findFirstDay(currentYear, currentMonth);

    let allDays = [];

    allDays.push(<div style={styles.week_day}>Lunedi</div>);
    allDays.push(<div style={styles.week_day}>Martedi</div>);
    allDays.push(<div style={styles.week_day}>Mercoledi</div>);
    allDays.push(<div style={styles.week_day}>Giovedi</div>);
    allDays.push(<div style={styles.week_day}>Venerdi</div>);
    allDays.push(<div style={styles.week_day}>Sabato</div>);
    allDays.push(<div style={styles.week_day}>Domenica</div>);

    for (let i = 0; i < firstDay; i++) {
      allDays.push(
        <div key={`empty-${i}`} style={styles.empty_calendar_box}></div>,
      );
    }

    for (let i = 1; i <= monthsTotalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSelected =
        calendarDate && calendarDate.toDateString() === date.toDateString();

      const isToday = currentDate.toDateString() === date.toDateString();

      allDays.push(
        <div
          key={`day-${i}`}
          style={
            isSelected
              ? styles.calendar_box_selected
              : isToday
                ? styles.calendar_box_today
                : styles.calendar_box
          }
          onClick={() => {
            handleDateClick(currentYear, currentMonth, i);
          }}
        >
          {i}
        </div>,
      );
    }

    return allDays;
  };

  const monthName = (month) => {
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];
    return months[month];
  };

  const renderYearCalendar = () => {
    const currentYear = calendarDate.getFullYear();
    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      const dateSelected = new Date(currentYear, i, calendarDate.getDate());
      const isSelected =
        calendarDate &&
        calendarDate.toDateString() === dateSelected.toDateString();

      const dateToday = new Date(currentYear, i, currentDate.getDate());
      const isToday = currentDate.toDateString() === dateToday.toDateString();

      allMonths.push(
        <div>
          <div
            style={
              isSelected
                ? styles.calendar_box_selected
                : isToday
                  ? styles.calendar_box_today
                  : styles.calendar_box
            }
            onClick={() => {
              handleDateClick(currentYear, i, 1);
            }}
          >
            {monthName(i)}
          </div>
        </div>,
      );
    }

    return allMonths;
  };

  const remapGetDay = (day) => {
    if (day === 0) return 6;
    return day - 1;
  };

  const renderWeekCalendar = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    let weekTotalDays = 7;
    const monthsTotalDays = findMonthsDays(currentYear, currentMonth);
    const firstDay = findFirstDay(currentYear, currentMonth);

    let allDays = [];

    allDays.push(<div style={styles.week_day}>Lunedi</div>);
    allDays.push(<div style={styles.week_day}>Martedi</div>);
    allDays.push(<div style={styles.week_day}>Mercoledi</div>);
    allDays.push(<div style={styles.week_day}>Giovedi</div>);
    allDays.push(<div style={styles.week_day}>Venerdi</div>);
    allDays.push(<div style={styles.week_day}>Sabato</div>);
    allDays.push(<div style={styles.week_day}>Domenica</div>);

    let firstWeekDay =
      calendarDate.getDate() - remapGetDay(calendarDate.getDay());

    if (firstWeekDay < 1) {
      let prevMonthThisWeekDays = 0;
      while (prevMonthThisWeekDays < firstDay) prevMonthThisWeekDays++;
      const prevMonthTotalDays = findMonthsDays(currentYear, currentMonth - 1);

      for (
        let i = prevMonthTotalDays - prevMonthThisWeekDays + 1;
        i <= prevMonthTotalDays;
        i++
      ) {
        const date = new Date(currentYear, currentMonth - 1, i);
        const isSelected =
          calendarDate && calendarDate.toDateString() === date.toDateString();

        const isToday = currentDate.toDateString() === date.toDateString();

        allDays.push(
          <div
            key={`day-${i}`}
            style={
              isSelected
                ? styles.calendar_day_week_box_selected
                : isToday
                  ? styles.calendar_day_week_box_today
                  : styles.calendar_day_week_box_other_month
            }
            onClick={() => {
              handleDateClick(currentYear, currentMonth - 1, i);
            }}
          >
            {i}
          </div>,
        );
        weekTotalDays--;
      }

      for (let i = 1; i <= weekTotalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const isSelected =
          calendarDate && calendarDate.toDateString() === date.toDateString();

        const isToday = currentDate.toDateString() === date.toDateString();

        allDays.push(
          <div
            key={`day-${i}`}
            style={
              isSelected
                ? styles.calendar_day_week_box_selected
                : isToday
                  ? styles.calendar_day_week_box_today
                  : styles.calendar_day_week_box
            }
            onClick={() => {
              handleDateClick(currentYear, currentMonth, i);
            }}
          >
            {i}
          </div>,
        );
      }
    } else {
      let j = 1;

      for (
        let i = firstWeekDay;
        j <= weekTotalDays && i <= monthsTotalDays;
        i++
      ) {
        const date = new Date(currentYear, currentMonth, i);
        const isSelected =
          calendarDate && calendarDate.toDateString() === date.toDateString();

        const isToday = currentDate.toDateString() === date.toDateString();

        allDays.push(
          <div
            key={`day-${i}`}
            style={
              isSelected
                ? styles.calendar_day_week_box_selected
                : isToday
                  ? styles.calendar_day_week_box_today
                  : styles.calendar_day_week_box
            }
            onClick={() => {
              handleDateClick(currentYear, currentMonth, i);
            }}
          >
            {i}
          </div>,
        );
        j++;
      }

      if (j <= weekTotalDays) {
        for (let i = 1; j <= weekTotalDays; i++, j++) {
          const date = new Date(currentYear, currentMonth + 1, i);
          const isSelected =
            calendarDate && calendarDate.toDateString() === date.toDateString();

          const isToday = currentDate.toDateString() === date.toDateString();

          allDays.push(
            <div
              key={`day-${i}`}
              style={
                isSelected
                  ? styles.calendar_day_week_box_selected
                  : isToday
                    ? styles.calendar_day_week_box_today
                    : styles.calendar_day_week_box_other_month
              }
              onClick={() => {
                handleDateClick(currentYear, currentMonth + 1, i);
              }}
            >
              {i}
            </div>,
          );
        }
      }
    }

    return allDays;
  };

  return (
    <div>
      <h1>Calendar Page</h1>
      <div>
        <button onClick={increaseZoomLevel}>Increase Zoom</button>
        <button onClick={decreaseZoomLevel}>Decrease Zoom</button>
      </div>
      {selectZoomLevel === 0 && (
        <>
          <div style={styles.month_name}>{calendarDate.getFullYear()}</div>
          <button onClick={changeToPrevYear}>Previous Year</button>
          <button onClick={changeToNextYear}>Next Year</button>
          <div style={styles.year_calendar}>{renderYearCalendar()}</div>
        </>
      )}

      {selectZoomLevel === 1 && (
        <>
          <button onClick={changeToPrevMonth}>Previous Month</button>
          <button onClick={changeToNextMonth}>Next Month</button>
          <div style={styles.month_name}>{renderMonth()}</div>
          <div style={styles.month_calendar}>{renderMonthCalendar()}</div>
        </>
      )}

      {selectZoomLevel === 2 && (
        <>
          <button onClick={changeToPrevWeek}>Previous Week</button>
          <button onClick={changeToNextWeek}>Next Week</button>
          <div style={styles.month_name}>{renderMonth()}</div>
          <div style={styles.week_calendar}>{renderWeekCalendar()}</div>
        </>
      )}
    </div>
  );
};

export default CalendarPage;

const styles = {
  month_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(7, auto)",
  },
  empty_calendar_box: {
    backgroundColor: "#f8f7f5",
    height: "100px",
    width: "100px",
  },
  calendar_box: {
    backgroundColor: "#f8f7f5",
    border: "2px solid rgb(40, 40, 40)",
    height: "100px",
    width: "100px",
  },
  calendar_box_selected: {
    border: "2px solid rgba(0, 47, 80, 0.77)",
    height: "100px",
    width: "100px",
    backgroundColor: "lightblue",
  },
  calendar_box_today: {
    border: "2px solid rgb(9, 152, 255)",
    height: "100px",
    width: "100px",
    backgroundColor: "rgb(212, 232, 248)",
  },
  week_day: {
    justifyContent: "center",
    alignItems: "center",
    height: "30px",
    width: "100px",
    textAlign: "center",
  },
  month_name: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  year_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
  },
  week_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(2, auto)",
  },
  calendar_day_week_box: {
    backgroundColor: "#f8f7f5",
    border: "2px solid rgb(40, 40, 40)",
    height: "350px",
    width: "100px",
  },
  calendar_day_week_box_other_month: {
    backgroundColor: "#f8f7f5",
    border: "2px solid rgb(167, 167, 167)",
    height: "350px",
    width: "100px",
  },
  calendar_day_week_box_selected: {
    border: "2px solid rgba(0, 47, 80, 0.77)",
    height: "350px",
    width: "100px",
    backgroundColor: "lightblue",
  },
  calendar_day_week_box_today: {
    border: "2px solid rgb(9, 152, 255)",
    height: "350px",
    width: "100px",
    backgroundColor: "rgb(212, 232, 248)",
  },
};
