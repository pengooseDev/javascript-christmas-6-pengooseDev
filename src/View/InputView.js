import { Console } from '@woowacourse/mission-utils';
import Validator from '../utils/Validator.js';
import CustomError from '../errors/error.js';
import MESSAGE from '../constants/message.js';
import ERROR from '../constants/error.js';
import Calander from '../Model/Calendar.js';

const InputView = {
  defaultRadix: 10,

  /**
   * 전달받은 메시지를 렌더링하여, 유저에게 값을 입력받습니다.
   * 빈 문자열이거나 공백일 경우, 에러를 생성합니다.
   * @param {string} message
   * @returns {string}
   */
  async readLineAsync(message) {
    const userInput = await Console.readLineAsync(message);

    if (Validator.isEmptyString(userInput) || Validator.isSpace(userInput)) {
      throw CustomError.inputView(ERROR.message.emptyString);
    }

    return userInput;
  },

  /**
   * 전달받은 메시지를 렌더링하여 유저에게 값을 입력받습니다.
   * 양의 정수가 아닌 경우, 에러를 생성합니다.
   * @param {string} message
   * @param {number} radix
   * @returns
   */
  async readPositiveIntegerAsync(message, radix = this.defaultRadix) {
    const userInput = await this.readLineAsync(message);

    if (!Validator.isPositiveInteger(userInput)) {
      throw CustomError.inputView(ERROR.message.notPositiveInteger);
    }

    return parseInt(userInput, radix);
  },

  async readDate() {
    const userInput = await Console.readLineAsync(MESSAGE.read.reservationDate);
    this.validateDate(userInput);

    return parseInt(userInput, this.defaultRadix);
  },

  validateDate(date) {
    if (
      !Validator.isPositiveInteger(date) ||
      !Validator.isInRange(date, Calander.initialDay, Calander.getLastDay())
    ) {
      throw CustomError.inputView(ERROR.message.date.invalidDate);
    }
  },

  async readOrder() {
    const userInput = await Console.readLineAsync(MESSAGE.read.order);

    return userInput;
  },
};

export default InputView;
