import OrderService from '../../src/Domain/OrderService.js';
import DEFAULT_MENUS from '../../src/constants/menu.js';
import ERROR from '../../src/constants/error.js';

describe('OrderService 테스트', () => {
  let orderServiceInstance;

  beforeEach(() => {
    orderServiceInstance = new OrderService(DEFAULT_MENUS);
  });

  describe('getBill 메서드는 주문에 대한 계산을 수행한다.', () => {
    // given
    const cases = [
      {
        input: '해산물파스타-2,레드와인-1,초코케이크-1',
        expected: {
          orderedMenus: [
            {
              menu: {
                price: 35000,
              },
              quantity: 2,
            },
            {
              menu: {
                price: 60000,
              },
              quantity: 1,
            },
            {
              menu: {
                price: 15000,
              },
              quantity: 1,
            },
          ],
          totalPrice: 145000,
        },
      },
      {
        input: '양송이수프-3,타파스-4,시저샐러드-1',
        expected: {
          orderedMenus: [
            {
              menu: {
                price: 6000,
              },
              quantity: 3,
            },
            {
              menu: {
                price: 5500,
              },
              quantity: 4,
            },
            {
              menu: {
                price: 5000,
              },
              quantity: 1,
            },
          ],
          totalPrice: 45000,
        },
      },
    ];

    test.each(cases)(
      '정상적인 주문($input)을 받았을 때, 주문 메뉴 수와 동일한 길이의 배열을 반환해야 한다.',
      ({ input, expected }) => {
        // when
        const { orderedMenus } = orderServiceInstance.getBill(input);

        // then
        expect(orderedMenus.length).toBe(expected.orderedMenus.length);
      },
    );

    test.each(cases)(
      '정상적인 주문($input)을 받았을 때, 총 가격을 반환해야 한다.',
      ({ input, expected }) => {
        // when
        const { totalPrice } = orderServiceInstance.getBill(input);

        // then
        expect(totalPrice).toEqual(expected.totalPrice);
      },
    );

    describe('예외 테스트', () => {
      const errorCases = [
        {
          input: '해산물파스타-2,레드와인,초코케이크-1',
          expectedError: ERROR.message.order.invalidOrder,
          description: '메뉴의 형식이 잘못된 경우',
        },
        {
          input: '해산물파스타-2,레드와인-1,레드와인-1',
          expectedError: ERROR.message.order.duplicatedOrder,
          description: '중복된 메뉴가 있는 경우',
        },
        {
          input: '해산물파스타-0,레드와인-1,초코케이크-1',
          expectedError: ERROR.message.order.invalidQuantity,
          description: '수량이 0인 경우',
        },
        {
          input: '',
          expectedError: ERROR.message.order.invalidOrder,
          description: '주문이 비어있는 경우',
        },
        {
          input: ',,',
          expectedError: ERROR.message.order.invalidOrder,
          description: '주문 구분자(쉼표)만 주어진 경우',
        },
        {
          input: '-',
          expectedError: ERROR.message.order.invalidOrder,
          description: '메뉴 구분자(쉼표)만 주어진 경우',
        },
        {
          input: '시저샐러드-1,,티본스테이크-1',
          expectedError: ERROR.message.order.invalidOrder,
          description: '빈 메뉴 항목이 포함된 경우',
        },
        {
          input: '시저샐러드-1.5,티본스테이크-1',
          expectedError: ERROR.message.order.invalidQuantity,
          description: '수량이 소수인 경우',
        },
        {
          input: '시저샐러드-a,티본스테이크-1',
          expectedError: ERROR.message.order.invalidQuantity,
          description: '수량이 숫자가 아닌 경우',
        },
        {
          input: '시저샐러드-1-1,티본스테이크-1',
          expectedError: ERROR.message.order.invalidOrder,
          description: '메뉴 구분자와 수량이 연속으로 포함된 경우',
        },
        {
          input: '해산물파스타--3,레드와인-1,초코케이크-1',
          expectedError: ERROR.message.order.invalidOrder,
          description: '메뉴 구분자가 여러개 들어가있는 경우',
        },
        {
          input: '시저샐러드1,티본스테이크-1',
          expectedError: ERROR.message.order.invalidOrder,
          description: '메뉴와 수량 사이에 구분자가 없는 경우',
        },
        {
          input: '시저샐러드-,티본스테이크-1',
          expectedError: ERROR.message.order.invalidOrder,
          description: '수량 정보가 누락된 경우',
        },

        // 아래의 테스트는 MenuBoard의 책임으로, MenuBoardTest에서 이미 테스트를 진행하지만 의존성 확인을 위해 작성.
        {
          input: '드래곤필레미뇽스테이크-1',
          expectedError: ERROR.message.menuBoard.menuNotFound,
          description: '존재하지 않는 메뉴를 주문하는 경우',
        },
        // invalidOrder로 구분하려다 예외처리가 너무 길어져(파싱 => trim 후 길이비교) 메뉴로 분류하되, 메뉴판 생성시 휴먼에러 방지를 위해 trim 파싱 추가.
        {
          input: '시저샐러드-1, 티본스테이크-1, 크리스마스파스타-1',
          expectedError: ERROR.message.menuBoard.menuNotFound,
          description: '메뉴 이름에 공백이 포함된 경우',
        },
      ];

      test.each(errorCases)(
        '주문에 $input, $description 에러를 반환해야 한다.',
        ({ input, expectedError }) => {
          // when
          const getBill = () => orderServiceInstance.getBill(input);

          // then
          expect(getBill).toThrow(expectedError);
        },
      );
    });
  });
});
