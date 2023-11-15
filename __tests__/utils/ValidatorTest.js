import Validator from '../../src/utils/Validator.js';

describe('Validator 객체 테스트', () => {
  describe('isEmptyString 메서드 테스트', () => {
    // given
    const cases = [
      { input: '', expected: true },
      { input: ' ', expected: false },
      { input: '문자열', expected: false },
      { input: null, expected: false },
      { input: undefined, expected: false },
      { input: NaN, expected: false },
      { input: 0, expected: false },
      { input: 1, expected: false },
    ];

    test.each(cases)(
      '$input이 빈 문자열인 경우, true를. 그렇지 않을 경우 false를 반환해야 한다',
      ({ input, expected }) => {
        // when
        const validate = Validator.isEmptyString(input);

        // then
        expect(validate).toBe(expected);
      },
    );
  });

  describe('isSpace 메서드 테스트', () => {
    const cases = [
      { input: '', expected: true },
      { input: ' ', expected: true },
      { input: '문자열', expected: false },
      { input: null, expected: false },
      { input: undefined, expected: false },
      { input: NaN, expected: false },
      { input: 0, expected: false },
      { input: 1, expected: false },
    ];

    test.each(cases)(
      '$input이 공백인 경우, true를. 그렇지 않을 경우 false를 반환해야 한다',
      ({ input, expected }) => {
        // when
        const validate = Validator.isSpace(input);

        // then
        expect(validate).toBe(expected);
      },
    );
  });

  describe('isPositiveInteger 메서드 테스트', () => {
    const cases = [
      { input: 1, expected: true },
      { input: 2, expected: true },
      { input: 5, expected: true },
      { input: 10, expected: true },
      { input: 0, expected: false },
      { input: -1, expected: false },
      { input: '문자열', expected: false },
      { input: null, expected: false },
      { input: undefined, expected: false },
      { input: NaN, expected: false },
      { input: '', expected: false },
      { input: ' ', expected: false },
    ];

    test.each(cases)(
      '$input이 양의 정수인 경우, true를. 그렇지 않을 경우 false를 반환해야 한다',
      ({ input, expected }) => {
        // when
        const validate = Validator.isPositiveInteger(input);

        // then
        expect(validate).toBe(expected);
      },
    );
  });

  describe('isInRange 메서드 테스트', () => {
    const cases = [
      { number: 1, min: 1, max: 10, expected: true },
      { number: 5, min: 1, max: 10, expected: true },
      { number: 10, min: 1, max: 10, expected: true },
      { number: 0, min: 1, max: 10, expected: false },
      { number: 11, min: 1, max: 10, expected: false },
    ];

    test.each(cases)(
      '$number가 $min ~ $max 범위에 포함되는 경우, true를. 그렇지 않을 경우 false를 반환해야 한다',
      ({ number, min, max, expected }) => {
        // when
        const validate = Validator.isInRange(number, min, max);

        expect(validate).toBe(expected);
      },
    );
  });

  describe('isValidArray 메서드 테스트', () => {
    const cases = [
      {
        value: '티본스테이크-1,바비큐립-1,초코케이크-2,제로콜라-1',
        separator: ',',
        inputLength: 4,
        expected: true,
      },
      {
        value: '티본스테이크-1,바비큐립-1,초코케이크-2,제로콜라-1',
        separator: ',',
        inputLength: null,
        expected: true,
      },
      {
        value: '티본스테이크-1,바비큐립-1,초코케이크-2,',
        separator: ',',
        inputLength: 3,
        expected: false,
      },
      { value: '1,2,', separator: ',', inputLength: 3, expected: false },
      { value: '1,2, ', separator: ',', inputLength: 3, expected: false },
      {
        value: '티본스테이크-1,바비큐립-1,초코케이크-2,제로콜라-1',
        separator: '-',
        inputLength: 4,
        expected: true,
      },
    ];

    test.each(cases)(
      '$separator로 $value를 split했을 경우, 각 배열은 공백이나 빈 문자열이 아니어야 한다.',
      ({ value, separator, inputLength, expected }) => {
        // when
        const validate = Validator.isValidArray({
          value,
          separator,
          inputLength,
        });

        // then
        expect(validate).toBe(expected);
      },
    );
  });
});
