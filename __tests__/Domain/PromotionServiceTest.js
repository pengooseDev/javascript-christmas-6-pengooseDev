import PromotionService from '../../src/Domain/PromotionSerivce.js';
import Calendar from '../../src/Model/Calendar.js';
import Promotion from '../../src/Model/Promotion.js';
import MENU from '../../src/constants/menu.js';

describe('PromotionService 클래스 테스트', () => {
  const month = Calendar.missionMonth;

  describe('생성자 테스트', () => {
    const cases = [
      {
        description:
          '총 주문 금액이 10,000원 이하일 경우, 프로모션 대상에서 제외된다.',
        bill: {
          totalPrice: 8_500,
          orderedMenus: [
            {
              name: '타파스',
              category: MENU.category.main,
              price: 5_500,
              quantity: 1,
            },
            {
              name: '제로콜라',
              category: MENU.category.drink,
              price: 3_000,
              quantity: 1,
            },
          ],
        },
        expected: {
          promotions: {},
        },
      },
      {
        description:
          '총 주문 금액이 10,000원 이상일 경우, 프로모션 대상이 된다.',
        bill: {
          totalPrice: 142_000,
          orderedMenus: [
            {
              name: '티본스테이크',
              category: MENU.category.main,
              price: 55_000,
              quantity: 1,
            },
            {
              name: '바비큐립',
              category: MENU.category.main,
              price: 54_000,
              quantity: 1,
            },
            {
              name: '초코케이크',
              category: MENU.category.dessert,
              price: 15_000,
              quantity: 2,
            },
            {
              name: '제로콜라',
              category: MENU.category.drink,
              price: 3_000,
              quantity: 1,
            },
          ],
        },
        expected: {
          promotions: {
            3: [
              Promotion.createChristmasDiscount(3),
              Promotion.createSpecialDiscount(),
              Promotion.createWeekdayDiscount(2),
              Promotion.createServiceMenu(142_000),
            ],
            24: [
              Promotion.createChristmasDiscount(24),
              Promotion.createSpecialDiscount(),
              Promotion.createWeekdayDiscount(2),
              Promotion.createServiceMenu(142_000),
            ],
            25: [
              Promotion.createChristmasDiscount(25),
              Promotion.createSpecialDiscount(),
              Promotion.createWeekdayDiscount(2),
              Promotion.createServiceMenu(142_000),
            ],
            31: [
              Promotion.createSpecialDiscount(),
              Promotion.createWeekdayDiscount(2),
              Promotion.createServiceMenu(142_000),
            ],
          },
        },
      },
    ];

    test.each(cases)('$description', ({ bill, expected }) => {
      // when
      const promotionService = new PromotionService({ month, bill });

      Object.keys(expected.promotions).forEach((date) => {
        const result = promotionService.getPromotion({ month, date });

        expect(result.promotions).toEqual(
          expect.arrayContaining(expected.promotions[date]),
        );
      });
    });
  });

  describe('getPromotion 메서드', () => {
    const cases = [
      {
        description:
          '총 주문 금액이 10,000원 이하일 경우, 프로모션 대상에서 제외된다.',
        date: 26,
        bill: {
          totalPrice: 8_500,
          orderedMenus: [
            {
              name: '타파스',
              category: MENU.category.main,
              price: 5_500,
              quantity: 1,
            },
            {
              name: '제로콜라',
              category: MENU.category.drink,
              price: 3_000,
              quantity: 1,
            },
          ],
        },
        expected: {
          promotions: [],
          totalDiscount: 0,
          totalPromotion: 0,
          badge: Promotion.createBadge(0),
        },
      },
      {
        description:
          '총 주문 금액이 10,000원 이상일 경우, 프로모션 대상이 된다.',
        date: 3,
        bill: {
          totalPrice: 142_000,
          orderedMenus: [
            {
              name: '티본스테이크',
              category: MENU.category.main,
              price: 55_000,
              quantity: 1,
            },
            {
              name: '바비큐립',
              category: MENU.category.main,
              price: 54_000,
              quantity: 1,
            },
            {
              name: '초코케이크',
              category: MENU.category.dessert,
              price: 15_000,
              quantity: 2,
            },
            {
              name: '제로콜라',
              category: MENU.category.drink,
              price: 3_000,
              quantity: 1,
            },
          ],
        },
        expected: {
          promotions: [
            Promotion.createChristmasDiscount(3),
            Promotion.createSpecialDiscount(),
            Promotion.createWeekdayDiscount(2),
            Promotion.createServiceMenu(142_000),
          ],
          totalDiscount: 6_246,
          totalPromotion: 31_246,
          badge: Promotion.createBadge(31_246),
        },
      },
    ];

    test.each(cases)('$description', ({ date, bill, expected }) => {
      // given
      const promotionService = new PromotionService({ month, bill });

      // when
      const result = promotionService.getPromotion({ month, date });

      // then
      expect(result).toEqual(expected);
    });

    test.each(cases)(
      'getPromotion 메서드는 프로모션 정보를 반환한다.',
      ({ date, bill, expected }) => {
        // given
        const promotionService = new PromotionService({ month, bill });

        // when
        const { promotions } = promotionService.getPromotion({ month, date });

        // then
        expect(promotions).toEqual(expected.promotions);
      },
    );

    test.each(cases)(
      'getPromotion 메서드는 총 할인 금액을 반환한다.',
      ({ date, bill, expected }) => {
        // given
        const promotionService = new PromotionService({ month, bill });

        // when
        const { totalDiscount } = promotionService.getPromotion({
          month,
          date,
        });

        // then
        expect(totalDiscount).toBe(expected.totalDiscount);
      },
    );

    test.each(cases)(
      'getPromotion 메서드는 총 프로모션 금액을 반환한다.',
      ({ date, bill, expected }) => {
        // given
        const promotionService = new PromotionService({ month, bill });

        // when
        const { totalPromotion } = promotionService.getPromotion({
          month,
          date,
        });

        // then
        expect(totalPromotion).toBe(expected.totalPromotion);
      },
    );

    test.each(
      'getPromotion 메서드는 배지 프로모션을 반환한다.',
      ({ date, bill, expected }) => {
        // given
        const promotionService = new PromotionService({ month, bill });

        // when
        const { badge } = promotionService.getPromotion({ month, date });

        // then
        expect(badge).toEqual(expected.badge);
      },
    );
  });
});
