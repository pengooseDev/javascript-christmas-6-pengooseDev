const message = Object.freeze({
  notPositiveInteger: '양의 정수만 입력할 수 있습니다.',
  menuNotFound: '유효하지 않은 주문입니다. 다시 입력해 주세요.',
  invalidPrice: '유효하지 않은 가격입니다.',
  duplicatedMenu: '중복된 메뉴가 존재합니다.',
});

const name = Object.freeze({
  menuBoard: 'menuBoard',
});

const ERROR = Object.freeze({
  message,
  name,
});

export default ERROR;
