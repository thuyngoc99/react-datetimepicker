import moment from 'moment';
import { ModeEnum } from '../DateTimeRangePicker';

export const generateHours = () => {
  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }
  return hours;
};

export const generateMinutes = () => {
  let minutes = [];
  for (let i = 0; i < 60; i++) {
    if (i < 10) {
      minutes.push(`0${i.toString()}`);
    } else {
      minutes.push(i.toString());
    }
  }
  return minutes;
};

function workOutMonthYear(date, secondDate, mode, pastSearchFriendly, smartMode) {
  // If both months are different months then
  // allow normal display in the calendar
  let selectedMonth = date.month();
  let otherMonth = secondDate.month();
  if (selectedMonth !== otherMonth) {
    return date;
  }
  // If pastSearch Friendly mode is on and both months are the same and the same year
  // have "end"/right as the month and "start"/left as -1 month
  else if (date.year() === secondDate.year() && mode === ModeEnum.start && pastSearchFriendly && smartMode) {
    let lastMonth = JSON.parse(JSON.stringify(date));
    lastMonth = moment(lastMonth);
    lastMonth.subtract(1, 'month');
    return lastMonth;
  }
  // If pastSearch Friendly mode is off and both months are the same and the same year
  // have "end"/right as the month and "start"/left as +1 month
  else if (date.year() === secondDate.year() && mode === ModeEnum.end && !pastSearchFriendly && smartMode) {
    let lastMonth = JSON.parse(JSON.stringify(date));
    lastMonth = moment(lastMonth);
    lastMonth.add(1, 'month');
    return lastMonth;
  } else {
    return date;
  }
}

export const getMonth = (date, secondDate, mode, pastSearchFriendly, smartMode) =>
  workOutMonthYear(date, secondDate, mode, pastSearchFriendly, smartMode).month();

export const getYear = (date, secondDate, mode, pastSearchFriendly, smartMode) =>
  workOutMonthYear(date, secondDate, mode, pastSearchFriendly, smartMode).year();

const getDaysBeforeStartMonday = firstDayOfMonth => {
  let fourtyTwoDays = [];
  let dayBeforeFirstDayOfMonth = firstDayOfMonth.day() - 1; // We dont want to include the first day of the new month
  // Case whereby day before is a Saturday (6) and we require Saturday back to Monday for that week
  if (dayBeforeFirstDayOfMonth === -1) {
    for (let i = 6; i > 0; i--) {
      let firstDayOfMonthCopy = firstDayOfMonth.clone();
      firstDayOfMonthCopy = firstDayOfMonthCopy.subtract(i, 'd');
      fourtyTwoDays.push(firstDayOfMonthCopy);
    }
  }
  // Case Whereby day before first day is the Sunday (0), therefore we want the entire previous week
  if (dayBeforeFirstDayOfMonth === 0) {
    for (let i = 7; i > 0; i--) {
      let firstDayOfMonthCopy = firstDayOfMonth.clone();
      firstDayOfMonthCopy = firstDayOfMonthCopy.subtract(i, 'd');
      fourtyTwoDays.push(firstDayOfMonthCopy);
    }
  }
  // Every other day
  else {
    for (let i = dayBeforeFirstDayOfMonth; i > 0; i--) {
      let firstDayOfMonthCopy = firstDayOfMonth.clone();
      firstDayOfMonthCopy = firstDayOfMonthCopy.subtract(i, 'd');
      fourtyTwoDays.push(firstDayOfMonthCopy);
    }
  }
  return fourtyTwoDays;
};

const getDaysBeforeStartSunday = firstDayOfMonth => {
  let fourtyTwoDays = [];
  let dayBeforeFirstDayOfMonth = firstDayOfMonth.day() - 1; // We dont want to include the first day of the new month

  // Case whereby we need all previous week days
  if (dayBeforeFirstDayOfMonth === -1) {
    for (let i = 7; i > 0; i--) {
      let firstDayOfMonthCopy = firstDayOfMonth.clone();
      firstDayOfMonthCopy = firstDayOfMonthCopy.subtract(i, 'd');
      fourtyTwoDays.push(firstDayOfMonthCopy);
    }
  }
  // Every other day
  else {
    for (let i = dayBeforeFirstDayOfMonth + 1; i > 0; i--) {
      let firstDayOfMonthCopy = firstDayOfMonth.clone();
      firstDayOfMonthCopy = firstDayOfMonthCopy.subtract(i, 'd');
      fourtyTwoDays.push(firstDayOfMonthCopy);
    }
  }
  return fourtyTwoDays;
};

const getDaysBeforeStart = (firstDayOfMonth, sundayFirst) => {
  if (!sundayFirst) {
    return getDaysBeforeStartMonday(firstDayOfMonth);
  } else {
    return getDaysBeforeStartSunday(firstDayOfMonth);
  }
};

export const getFourtyTwoDays = (initMonth, initYear, sundayFirst) => {
  let fourtyTwoDays = [];
  let firstDayOfMonth = moment(new Date(initYear, initMonth, 1));

  fourtyTwoDays = getDaysBeforeStart(firstDayOfMonth, sundayFirst);
  // Add in all days this month
  for (let i = 0; i < firstDayOfMonth.daysInMonth(); i++) {
    fourtyTwoDays.push(firstDayOfMonth.clone().add(i, 'd'));
  }
  // Add in all days at the end of the month until last day of week seen
  let lastDayOfMonth = moment(new Date(initYear, initMonth, firstDayOfMonth.daysInMonth()));
  let toAdd = 1;
  let gotAllDays = false;
  while (!gotAllDays) {
    if (fourtyTwoDays.length >= 42) {
      gotAllDays = true;
      break;
    }
    fourtyTwoDays.push(lastDayOfMonth.clone().add(toAdd, 'd'));
    toAdd++;
  }
  return fourtyTwoDays;
};

export const isInbetweenDates = (isStartDate, dayToFindOut, start, end) => {
  let isInBetweenDates;
  if (isStartDate) {
    isInBetweenDates = dayToFindOut.isAfter(start) && dayToFindOut.isBefore(end);
  } else {
    isInBetweenDates = dayToFindOut.isBefore(start) && dayToFindOut.isAfter(end);
  }
  return isInBetweenDates;
};

export const isValidTimeChange = (mode, date, start, end) => {
  let modeStartAndDateSameOrBeforeStart = mode === 'start' && date.isSameOrBefore(end);
  let modeEndAndDateSameOrAfterEnd = mode === 'end' && date.isSameOrAfter(start);
  return modeStartAndDateSameOrBeforeStart || modeEndAndDateSameOrAfterEnd;
};

export const hoverCellActiveStyle = () => ({
  borderRadius: '200px',
  color: '#FFFFFF',
  backgroundColor: '#D6396C',
  cursor: 'pointer',
});

export const hoverTodayDateStyle = () => ({
  borderRadius: '200px',
  color: '#344054',
  backgroundColor: '#F9FAFB',
  cursor: 'pointer',
});

export const todayDateActiveStyle = () => ({
  borderRadius: '200px',
  color: '#FFFFFF',
  backgroundColor: '#E83C70',
  cursor: 'pointer',
});

export const todayDateStyle = () => ({
  borderRadius: '200px',
  color: '#344054',
  backgroundColor: '#F2F4F7',
  cursor: 'pointer',
});

export const startDateStyle = () => ({
  borderRadius: '200px',
  borderColour: 'transparent',
  color: '#FFFFFF',
  backgroundColor: '#E83C70',
  cursor: 'pointer',
});

export const endDateStyle = () => ({
  borderRadius: '200px',
  borderColour: 'transparent',
  color: '#FFFFFF',
  backgroundColor: '#E83C70',
  cursor: 'pointer',
});

export const inBetweenStyle = () => ({
  borderRadius: '0',
  borderColour: 'transparent',
  color: '#344054',
  backgroundColor: '#F9FAFB',
  cursor: 'pointer',
  // backgroundRepeat: 'no-repeat',
  // backgroundPosition: 'center',
  // backgroundSize: 'contain',
});

export const normalCellStyle = darkMode => {
  let color = darkMode ? '#FFFFFF' : '#344054';
  return {
    borderRadius: '20px',
    color: color,
  };
};

export const hoverCellStyle = (between, darkMode, isStart, isEnd) => {
  let borderRadius = '20px';
  let color = darkMode ? '#344054' : '#344054';
  let backgroundColor = darkMode ? '#FFFFFF' : '#F9FAFB';
  if (between) {
    // borderRadius = '0 0 0 0';
  }
  if (isStart || isEnd) {
    backgroundColor = 'none';
    color = '#FFFFFF';
  }

  return {
    borderRadius: borderRadius,
    color: color,
    backgroundColor: backgroundColor,
    cursor: 'pointer',
  };
};

export const greyCellStyle = darkMode => {
  let color = '#667085';
  let backgroundColor = darkMode ? '#777777' : '';
  let borderRadius = '20px';
  return {
    borderRadius: borderRadius,
    color: color,
    backgroundColor: backgroundColor,
    cursor: 'pointer',
  };
};

export const greyCellInvalidStyle = darkMode => {
  let color = '#667085';
  let backgroundColor = darkMode ? '#777777' : '';
  let borderRadius = '20px';
  return {
    color: color,
    backgroundColor: backgroundColor,
    borderRadius: borderRadius,
  };
};

export const invalidStyle = darkMode => {
  let style = greyCellInvalidStyle(darkMode);
  style.cursor = 'not-allowed';
  return style;
};

export const rangeButtonSelectedStyle = () => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '10px 16px',
  width: 160,
  height: 40,
  background: '#F9FAFB',
  borderRadius: 6,
  color: '#344054',
  cursor: 'pointer',
});

export const rangeButtonStyle = () => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '10px 16px',
  width: 160,
  height: 40,
  background: '#FFFFFF',
  borderRadius: 6,
  color: '#344054',
});
