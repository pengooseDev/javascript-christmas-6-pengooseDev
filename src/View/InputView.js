import { Console } from '@woowacourse/mission-utils';
import Validator from '../utils/Validator.js';
import CustomError from '../errors/error.js';
import MESSAGE from '../constants/message.js';
import ERROR from '../constants/error.js';
import Calander from '../Model/Calander.js';

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

  // FIXME: View가 날짜에 대한 정보를 들고있는게 맞나? OrderService로 추후에 넘기기.
  validateDate(date) {
    if (
      !Validator.isPositiveInteger(date) ||
      !Validator.isInRange(date, Calander.initialDay, Calander.getLastDay())
    ) {
      throw CustomError.inputView(ERROR.message.invalidDate);
    }
  },

  async readOrder() {
    const userInput = await Console.readLineAsync(MESSAGE.read.order);
    this.validateOrderForm(userInput);

    return userInput;
  },

  // FIXME: 이 친구들도 OrderService 완성되면 이동하기.
  validateOrderForm(order) {
    if (!Validator.isValidArray({ value: order, separator: ',' })) {
      throw CustomError.inputView(ERROR.message.invalidOrder);
    }

    order.split(',').forEach(this.validateMenuForm.bind(this));
  },

  validateMenuForm(menu) {
    if (!Validator.isValidArray({ value: menu, separator: '-' })) {
      throw CustomError.inputView(ERROR.message.invalidOrder);
    }
  },
};

export default InputView;
