import ERROR from '../constants/error.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';

const Calendar = {
  initialDay: 1,
  lastDay: 31,
  initialMonth: 1,
  lastMonth: 12,
  missionMonth: 12,

  getMonth() {
    // const month = new Date().getMonth() + 1;
    const month = this.missionMonth; // 주어진 미션은 실제 달력에 기반하지 않고, 12월로 상정하였기에 아래와 같이 상수로 지정.
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
    const year = new Date().getFullYear();
    const month = this.getMonth();

    return new Date(year, month, 0).getDate();
  },

  validateDay(day) {
    if (
      !Validator.isPositiveInteger(day) ||
      !Validator.isInRange(day, this.initialDay, this.lastDay)
    ) {
      throw CustomError.inputView(ERROR.message.calendar.invalidDay);
    }
  },
};

export default Calendar;
