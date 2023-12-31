import ERROR from '../constants/error.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';

const Calendar = {
  initialDay: 1,
  maxDay: 31,
  initialMonth: 1,
  lastMonth: 12,
  missionMonth: 12,
  missionFullYear: 2023,
  missionWeekend: [5, 6],

  getMonth() {
    // 주어진 미션은 실제 달력에 기반하지 않고, 12월로 상정하였기에 아래와 같이 상수로 지정.
    const month = this.missionMonth;
    this.validateMonth(month);

    return this.missionMonth;
  },

  validateMonth(month) {
    if (
      !Validator.isPositiveInteger(month) ||
      !Validator.isInRange(month, this.initialMonth, this.lastMonth)
    ) {
      throw CustomError.inputView(ERROR.message.calendar.invalidMonth);
    }
  },

  getLastDay() {
    const year = this.missionFullYear;
    const month = this.getMonth();

    return new Date(year, month, 0).getDate();
  },

  validateDay(day) {
    if (
      !Validator.isPositiveInteger(day) ||
      !Validator.isInRange(day, this.initialDay, this.maxDay)
    ) {
      throw CustomError.inputView(ERROR.message.calendar.invalidDay);
    }
  },

  isWeekend(month, day) {
    const year = this.missionFullYear;
    const date = new Date(year, month - 1, day);
    const currentDay = date.getDay();

    return this.missionWeekend.includes(currentDay);
  },

  isSunday(month, day) {
    const year = this.missionFullYear;
    const date = new Date(year, month - 1, day);
    const currentDay = date.getDay();

    return currentDay === 0;
  },

  isChristmas(month, day) {
    return month === this.missionMonth && day === 25;
  },
};

export default Calendar;
