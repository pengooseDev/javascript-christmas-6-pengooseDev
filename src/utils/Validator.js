const Validator = {
  emptyString: '',

  /**
   * 해당 값이 빈 문자열인지 확인합니다.
   * @param {string} value
   * @returns boolean
   */
  isEmptyString(value) {
    return value === this.emptyString;
  },

  /**
   * 해당 값이 공백인지 확인합니다.
   * @param {string} value
   * @returns boolean
   */
  isSpace(value) {
    return String(value).trim() === this.emptyString;
  },

  /**
   * 해당 값이 양의 정수인지 확인합니다.
   * @param {*} value
   * @returns boolean
   */
  isPositiveInteger(value) {
    return (
      !Validator.isSpace(value) &&
      Number.isInteger(Number(value)) &&
      Number(value) > 0
    );
  },

  isInRange(number, min, max) {
    return number >= min && number <= max;
  },

  isValidArray({ value, separator, length = null }) {
    const array = value.split(separator);

    return (
      array.every((item) => !Validator.isSpace(item)) &&
      (length === null || array.length === length)
    );
  },
};

export default Validator;
