import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";

const CalendarPage = () => {
  const { currentDate } = useContext(CurrentDateContext);
  const [calendarDate, setCalendarDate] = useState(currentDate);

  const findMonthsDays = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const findFirstDay = (year, month) => {
    return new Date(year, month, 1).getDay();
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

  const renderCalendar = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    const monthsTotalDays = findMonthsDays(currentYear, currentMonth);
    const firstDay = findFirstDay(currentYear, currentMonth);

    let allDays = [];

    for (let i = 0; i < firstDay; i++) {
      allDays.push(
        <div key={`empty-${i}`} className="empty_calendar_box"></div>,
      );
    }

    for (let i = 1; i <= monthsTotalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSelected =
        calendarDate && calendarDate.toDateString() === date.toDateString();

      allDays.push(
        <div
          key={`day-${i}`}
          className={`calendar_box_${isSelected ? "selected" : ""}`}
          onClick={() => handleDateClick(currentYear, currentMonth, i)}
        >
          {i}
        </div>,
      );
    }

    return allDays;
  };

  return (
    <div>
      <h1>Calendar Page</h1>
      <div>
        <button onClick={changeToPrevMonth}>Previous Month</button>
        <button onClick={changeToNextMonth}>Next Month</button>
      </div>
      <div className="calendar">{renderCalendar()}</div>
      {calendarDate && <div>Selected date: {calendarDate.toDateString()}</div>}
    </div>
  );
};

export default CalendarPage;
