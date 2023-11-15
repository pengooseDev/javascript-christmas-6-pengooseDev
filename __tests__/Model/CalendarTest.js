import Calendar from '../../src/Model/Calendar.js';
import CustomError from '../../src/errors/error.js';
import ERROR from '../../src/constants/error.js';

describe('Calendar 클래스 테스트', () => {
  test('getMonth 메서드는 미션에서 정해둔 12월이 반환되어야 한다.', () => {
    // given & when
    const month = Calendar.getMonth();

    // then
    expect(month).toBe(Calendar.missionMonth);
  });

  test('getLastDay 메서드는 미션에서 정해둔 12월의 마지막 날이 반환된다.', () => {
    // given & when
    const lastDay = Calendar.getLastDay();

    expect(lastDay).toBe(31);
  });

  describe('validateMonth 메서드', () => {
    // given
    const validCases = Array.from({ length: 12 }, (_, index) => index + 1);
    const invalidCases = [-1, 0, 1.5, 13, 14, 'e', 'a', NaN];

    test.each(validCases)(
      '인자로 유효한 달($month)이 전달될 경우, 에러가 발생하지 않는다.',
      (month) => {
        // when
        const validateMonth = () => Calendar.validateMonth(month);

        // then
        expect(validateMonth).not.toThrow();
      },
    );

    describe('예외 테스트', () => {
      test.each(invalidCases)(
        '인자로 유효하지 않은 달($invalidMonth)이 전달될 경우, 에러가 발생한다.',
        (invalidMonth) => {
          // when
          const validateMonth = () => Calendar.validateMonth(invalidMonth);

          // then
          expect(validateMonth).toThrow(
            CustomError.inputView(ERROR.message.calendar.invalidMonth),
          );
        },
      );
    });
  });

  describe('validateDay 메서드', () => {
    // given
    const validCases = [1, 2, 5, 10, 20, 30, 31];
    const invalidCases = [-1, 0, 1.5, 32, 33, 'e', 'a', NaN];

    test.each(validCases)(
      '인자로 유효한 일($day)이 전달될 경우, 에러가 발생하지 않는다.',
      (day) => {
        // when
        const validateDay = () => Calendar.validateDay(day);

        // then
        expect(validateDay).not.toThrow();
      },
    );

    describe('예외 테스트', () => {
      test.each(invalidCases)(
        '인자로 유효하지 않은 일($invalidDay)이 전달될 경우, 에러가 발생한다.',
        (invalidDay) => {
          // when
          const validateDay = () => Calendar.validateDay(invalidDay);

          // then
          expect(validateDay).toThrow(
            CustomError.inputView(ERROR.message.calendar.invalidDay),
          );
        },
      );
    });
  });

  describe('isWeekend 메서드', () => {
    // given
    const validCases = [
      { month: 12, day: 1, expected: true },
      { month: 12, day: 2, expected: true },
      { month: 12, day: 8, expected: true },
      { month: 12, day: 9, expected: true },
      { month: 12, day: 29, expected: true },
      { month: 12, day: 30, expected: true },
    ];

    const inValidCases = [
      { month: 12, day: 3, expected: false },
      { month: 12, day: 4, expected: false },
      { month: 12, day: 5, expected: false },
      { month: 12, day: 6, expected: false },
      { month: 12, day: 28, expected: false },
      { month: 12, day: 31, expected: false },
    ];

    test.each(validCases)(
      '12월 $day일이 주말이기 때문에, true를 반환한다.',
      ({ month, day, expected }) => {
        // when
        const checkWeekend = Calendar.isWeekend(month, day);

        // then
        expect(checkWeekend).toBe(expected);
      },
    );

    test.each(inValidCases)(
      '12월 $day일은 주말이 아니기 때문에, false를 반환한다.',
      ({ month, day, expected }) => {
        // when
        const checkWeekend = Calendar.isWeekend(month, day);

        // then
        expect(checkWeekend).toBe(expected);
      },
    );
  });

  describe('isSunday 메서드', () => {
    // given
    const validCases = [
      { month: 12, day: 3, isSunday: true },
      { month: 12, day: 10, isSunday: true },
      { month: 12, day: 17, isSunday: true },
      { month: 12, day: 24, isSunday: true },
      { month: 12, day: 31, isSunday: true },
    ];

    const invalidCases = [
      { month: 12, day: 1, isSunday: false },
      { month: 12, day: 5, isSunday: false },
      { month: 12, day: 7, isSunday: false },
      { month: 12, day: 22, isSunday: false },
      { month: 12, day: 30, isSunday: false },
    ];

    test.each(validCases)(
      '12월 $day일이 일요일이기 때문에, true를 반환한다.',
      ({ month, day, isSunday }) => {
        // when
        const checkSunday = Calendar.isSunday(month, day);

        // then
        expect(checkSunday).toBe(isSunday);
      },
    );

    test.each(invalidCases)(
      '12월 $day일은 일요일이 아니기 때문에, false를 반환한다.',
      ({ month, day, isSunday }) => {
        // when
        const checkSunday = Calendar.isSunday(month, day);

        // then
        expect(checkSunday).toBe(isSunday);
      },
    );
  });

  describe('isChristmas 메서드', () => {
    // given
    const notChristmasCases = [
      { month: 1, day: 25 },
      { month: 3, day: 25 },
      { month: 5, day: 25 },
      { month: 7, day: 25 },
      { month: 9, day: 25 },
      { month: 12, day: 24 },
      { month: 12, day: 26 },
    ];

    test('12월 25일은 크리스마스이다. 메리 크리스마스~', () => {
      // when
      const isChristmas = Calendar.isChristmas(12, 25);

      // then
      expect(isChristmas).toBe(true);
    });

    test.each(notChristmasCases)(
      '$month월 $day일은 크리스마스가 아니다.',
      ({ month, day }) => {
        // when
        const isChristmas = Calendar.isChristmas(month, day);

        expect(isChristmas).toBe(false);
      },
    );
  });
});
