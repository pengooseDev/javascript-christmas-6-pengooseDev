const category = Object.freeze({
  appitizer: '애피타이저',
  main: '메인',
  dessert: '디저트',
  drink: '음료',
});

const defaultMenus = [
  {
    category: category.appitizer,
    name: '양송이수프',
    price: 6000,
  },
  {
    category: category.appitizer,
    name: '타파스',
    price: 5500,
  },
  {
    category: category.appitizer,
    name: '시저샐러드',
    price: 5000,
  },
  {
    category: category.main,
    name: '티본스테이크',
    price: 55000,
  },
  {
    category: category.main,
    name: '바비큐립',
    price: 54000,
  },
  {
    category: category.main,
    name: '해산물파스타',
    price: 35000,
  },
  {
    category: category.main,
    name: '크리스마스파스타',
    price: 25000,
  },
  {
    category: category.dessert,
    name: '초코케이크',
    price: 15000,
  },
  {
    category: category.dessert,
    name: '아이스크림',
    price: 5000,
  },
  {
    category: category.drink,
    name: '제로콜라',
    price: 3000,
  },
  {
    category: category.drink,
    name: '레드와인',
    price: 60000,
  },
  {
    category: category.drink,
    name: '샴페인',
    price: 25000,
  },
];

const MENU = Object.freeze({ category, defaultMenus });

export default MENU;
