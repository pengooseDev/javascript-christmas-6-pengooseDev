import ERROR from '../constants/error.js';
import MessageFormat from '../utils/messageFormat.js';

class CustomError extends Error {
  constructor(message, name) {
    super(MessageFormat.error(message));
    this.name = name || this.constructor.name;
  }

  static inputView(message) {
    return new CustomError(message, ERROR.name.inputView);
  }

  static menuBoard(message) {
    return new CustomError(message, ERROR.name.menuBoard);
  }

  static orderService(message) {
    return new CustomError(message, ERROR.name.orderService);
  }

  static promotion(message) {
    return new CustomError(message, ERROR.name.promotion);
  }
}

export default CustomError;
