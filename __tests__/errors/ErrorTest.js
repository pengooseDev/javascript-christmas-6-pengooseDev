import CustomError from '../../src/errors/error.js';
import ERROR from '../../src/constants/error.js';

describe('CustomError 클래스 테스트', () => {
  const errorMessage = '에러다! 에러야!';

  describe('모든 에러메시지는 [ERROR]로 시작해야한다.', () => {
    // given
    const errorCases = [
      {
        type: 'inputView',
        createError: CustomError.inputView,
        expectedName: ERROR.name.inputView,
      },
      {
        type: 'menuBoard',
        createError: CustomError.menuBoard,
        expectedName: ERROR.name.menuBoard,
      },
      {
        type: 'orderService',
        createError: CustomError.orderService,
        expectedName: ERROR.name.orderService,
      },
      {
        type: 'promotion',
        createError: CustomError.promotion,
        expectedName: ERROR.name.promotion,
      },
    ];

    test.each(errorCases)('$type 에러 메시지 테스트', ({ createError }) => {
      // when
      const { message } = createError(errorMessage);

      // then
      expect(message).toBe(`[ERROR] ${errorMessage}`);
    });

    test.each(errorCases)(
      '$type 에러가 생성되는 경우, 이에 맞는 name($name)을 갖는다.',
      ({ createError, expectedName }) => {
        // when
        const { name } = createError(errorMessage);

        // then
        expect(name).toBe(expectedName);
      },
    );
  });
});
