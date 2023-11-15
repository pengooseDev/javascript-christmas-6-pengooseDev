import Promotion from '../../src/Model/Promotion.js';
import CHRISTMAS_PROMOTION from '../../src/constants/christmasPromotion.js';
import ERROR from '../../src/constants/error.js';
import CustomError from '../../src/errors/error.js';

describe('Promotion 클래스 테스트', () => {
  describe('크리스마스 디데이 할인', () => {
    // given
    const cases = [
      {
        day: 1,
        expectedDiscount: CHRISTMAS_PROMOTION.dateDiscount.christmasDefault,
      },
      { day: 2, expectedDiscount: 1_100 },
      { day: 5, expectedDiscount: 1_400 },
      { day: 10, expectedDiscount: 1_900 },
      { day: 24, expectedDiscount: 3_300 },
      { day: 25, expectedDiscount: 3_400 },
      // Promotion 객체는 날짜, 숫자에 대한 검증만을 진행할 뿐, 비즈니스 로직에 대한 검증은 진행하지 아니합니다.
      { day: 26, expectedDiscount: 3_500 },
      { day: 27, expectedDiscount: 3_600 },
      { day: 31, expectedDiscount: 4_000 },
    ];

    test.each(cases)(
      '날짜($day일)이 인자로 전달될 경우, $expectedDiscount원의 크리스마스 할인이 생성된다',
      ({ day, expectedDiscount }) => {
        // when
        const promotion = Promotion.createChristmasDiscount(day);

        // then
        expect(promotion).toEqual(
          expect.objectContaining({
            promotionType: Promotion.promotionType.discount,
            promotionName: CHRISTMAS_PROMOTION.promotionName.christmas,
            reward: expectedDiscount,
          }),
        );
      },
    );

    describe('예외 테스트', () => {
      // given
      const invalidDateCases = [
        { invalidDay: -5, expectedMessage: ERROR.message.date.invalidDay },
        { invalidDay: 0, expectedMessage: ERROR.message.date.invalidDay },
        { invalidDay: 32, expectedMessage: ERROR.message.date.invalidDay },
        {
          invalidDay: '숫자인척 하는 친구',
          expectedMessage: ERROR.message.date.invalidDay,
        },
        {
          invalidDay: NaN,
          expectedMessage: ERROR.message.date.invalidDay,
        },
        {
          invalidDay: '',
          expectedMessage: ERROR.message.date.invalidDay,
        },
        {
          invalidDay: ' ',
          expectedMessage: ERROR.message.date.invalidDay,
        },
      ];

      test.each(invalidDateCases)(
        '유효하지 않은 날짜($invalidDay일)를 입력할 경우, 에러가 발생한다',
        (invalidDay) => {
          // when
          const createPromotion = () =>
            Promotion.createChristmasDiscount(invalidDay);

          expect(createPromotion).toThrow(
            CustomError.promotion(ERROR.message.date.invalidDay),
          );
        },
      );
    });
  });

  describe('평일 할인 생성 경우', () => {
    // given
    const cases = [
      { quantity: 0, expectedReward: 0 },
      { quantity: 1, expectedReward: 2023 },
      { quantity: 2, expectedReward: 4046 },
      { quantity: 10, expectedReward: 20_230 },
      { quantity: 20, expectedReward: 40_460 },
    ];

    test.each(cases)(
      '유효한 수량($quantity)이 인자로 전달될 경우, 개수에 맞는 평일 할인이 생성된다.',
      ({ quantity, expectedReward }) => {
        const promotion = Promotion.createWeekdayDiscount(quantity);

        expect(promotion).toEqual(
          expect.objectContaining({
            promotionType: Promotion.promotionType.discount,
            promotionName: CHRISTMAS_PROMOTION.promotionName.weekday,
            reward: expectedReward,
          }),
        );
      },
    );

    describe('예외 테스트', () => {
      // given
      const invalidQuantityCases = [
        {
          invalidQuantity: -1,
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: '숫자인척 하는 친구',
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: NaN,
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: '',
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: ' ',
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
      ];

      test.each(invalidQuantityCases)(
        '유효하지 않은 수량($invalidQuantity)을 입력할 경우, 에러가 발생한다',
        (invalidQuantity) => {
          // when
          const createPromotion = () =>
            Promotion.createWeekdayDiscount(invalidQuantity);

          expect(createPromotion).toThrow(
            CustomError.promotion(ERROR.message.promotion.invalidQuantity),
          );
        },
      );
    });
  });

  describe('주말 할인 생성 경우', () => {
    // given
    const cases = [
      { quantity: 0, expectedReward: 0 },
      { quantity: 1, expectedReward: 2023 },
      { quantity: 2, expectedReward: 4046 },
      { quantity: 10, expectedReward: 20_230 },
      { quantity: 20, expectedReward: 40_460 },
    ];

    test.each(cases)(
      '유효한 수량($quantity)이 인자로 전달될 경우, 개수에 맞는 주말 할인이 생성된다',
      ({ quantity, expectedReward }) => {
        const promotion = Promotion.createWeekendDiscount(quantity);

        expect(promotion).toEqual(
          expect.objectContaining({
            promotionType: Promotion.promotionType.discount,
            promotionName: CHRISTMAS_PROMOTION.promotionName.weekend,
            reward: expectedReward,
          }),
        );
      },
    );

    describe('예외 테스트', () => {
      // given
      const invalidQuantityCases = [
        {
          invalidQuantity: -1,
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: '숫자인척 하는 친구',
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: NaN,
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: '',
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
        {
          invalidQuantity: ' ',
          expectedMessage: ERROR.message.promotion.invalidQuantity,
        },
      ];

      test.each(invalidQuantityCases)(
        '유효하지 않은 수량($invalidQuantity)을 입력할 경우, 에러가 발생한다',
        (invalidQuantity) => {
          // when
          const createPromotion = () =>
            Promotion.createWeekendDiscount(invalidQuantity);

          expect(createPromotion).toThrow(
            CustomError.promotion(ERROR.message.promotion.invalidQuantity),
          );
        },
      );
    });
  });

  test('특별 할인이 생성된다', () => {
    const promotion = Promotion.createSpecialDiscount();

    expect(promotion).toEqual(
      expect.objectContaining({
        promotionType: Promotion.promotionType.discount,
        promotionName: CHRISTMAS_PROMOTION.promotionName.special,
        reward: CHRISTMAS_PROMOTION.dateDiscount.special,
      }),
    );
  });

  describe('배지 생성 경우', () => {
    const cases = [
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.santa + 1,
        expectedBadge: CHRISTMAS_PROMOTION.badge.santa,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.santa,
        expectedBadge: CHRISTMAS_PROMOTION.badge.santa,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.santa - 1,
        expectedBadge: CHRISTMAS_PROMOTION.badge.tree,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.tree + 1,
        expectedBadge: CHRISTMAS_PROMOTION.badge.tree,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.tree,
        expectedBadge: CHRISTMAS_PROMOTION.badge.tree,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.tree - 1,
        expectedBadge: CHRISTMAS_PROMOTION.badge.star,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.star + 1,
        expectedBadge: CHRISTMAS_PROMOTION.badge.star,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.star,
        expectedBadge: CHRISTMAS_PROMOTION.badge.star,
      },
      {
        totalDiscount: CHRISTMAS_PROMOTION.threshold.star - 1,
        expectedBadge: null,
      },
    ];

    test.each(cases)(
      '할인 금액($totalDiscount)이 인자로 전달될 경우, $expectedBadge 배지가 생성된다',
      ({ totalDiscount, expectedBadge }) => {
        const promotion = Promotion.createBadge(totalDiscount);

        expect(promotion).toEqual(
          expect.objectContaining({
            promotionType: Promotion.promotionType.badge,
            promotionName: CHRISTMAS_PROMOTION.promotionName.badge,
            reward: expectedBadge,
          }),
        );
      },
    );
  });
});
