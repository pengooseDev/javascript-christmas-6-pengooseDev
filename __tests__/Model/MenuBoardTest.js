import MenuBoard from '../../src/Model/MenuBoard.js';
import ERROR from '../../src/constants/error.js';

describe('MenuBoard 클래스 테스트', () => {
  const validMenus = [
    { name: 'menu1', category: 'category1', price: 10000 },
    { name: 'menu2', category: 'category2', price: 5000 },
    { name: 'menu3', category: 'category3', price: 3000 },
    { name: 'menu4', category: 'category4', price: 2000 },
  ];

  describe('메뉴판을 생성하는 경우', () => {
    const errorCases = [
      {
        category: 'category1',
        name: 'menu1',
        price: 1_000,
      },
      {
        category: 'category2',
        name: 'menu2',
        price: 5_000,
      },
      {
        category: 'category1',
        name: 'menu3',
        price: 3_000,
      },
      {
        category: 'category2',
        name: 'menu4',
        price: 2_000,
      },
    ];

    test.each(errorCases)(
      '중복된 이름의 메뉴가 존재하는 경우, 카테고리의 값과 상관없이 예외가 발생해야 한다.',
      (existMenu) => {
        // given1
        const invalidMenu = [...validMenus, existMenu];

        // when
        const createMenuBoard = () => new MenuBoard(invalidMenu);

        // then
        expect(createMenuBoard).toThrow(ERROR.message.duplicatedMenu);
      },
    );

    const invalidPriceCases = [
      { name: 'invalidPrice(minus)', category: 'category1', price: -1_000 },
      { name: 'invalidPrice(zero)', category: 'category1', price: 0 },
      {
        name: 'invalidPrice(string)',
        category: 'category1',
        price: 'pengoose',
      },
      { category: 'category1', price: 1.5, name: 'invalidPrice(float)' },
      { category: 'category1', price: NaN, name: 'invalidPrice(NaN)' },
      {
        category: 'category1',
        price: Infinity,
        name: 'invalidPrice(Infinity)',
      },
    ];

    test.each(invalidPriceCases)(
      '가격이 양의 정수가 아닌 경우($name), 예외가 발생한다.',
      ({ name, category, price }) => {
        // given
        const menusWithInvalidPrice = [
          ...validMenus,
          { name, category, price },
        ];

        // when
        const createMenuBoard = () => new MenuBoard(menusWithInvalidPrice);

        // then
        expect(createMenuBoard).toThrow(ERROR.message.invalidPrice);
      },
    );
  });

  describe('메뉴판을 조회하는 경우', () => {
    let menuBoard;

    beforeEach(() => {
      menuBoard = new MenuBoard(validMenus);
    });

    test('존재하지 않는 메뉴를 조회하면 예외가 발생한다.', () => {
      const nonExistentMenu = 'nonExistentMenu';

      expect(() => {
        menuBoard.selectMenu(nonExistentMenu);
      }).toThrow(ERROR.message.menuNotFound);
    });

    test('메뉴를 조회하면 해당 메뉴의 상세 정보를 반환한다.', () => {
      expect(menuBoard.selectMenu('menu1')).toEqual({
        name: 'menu1',
        category: 'category1',
        price: 10_000,
      });
    });
  });
});
