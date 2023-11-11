const message = Object.freeze({
  // input
  emptyString: '사용자의 입력이 없습니다.',
  notPositiveInteger: '양의 정수만 입력할 수 있습니다.',

  // date
  invalidDate: '유효하지 않은 날짜입니다.',

  // menuBoard(get)
  menuNotFound: '유효하지 않은 주문입니다.',

  // menuBoard(create)
  invalidPrice: '유효하지 않은 가격입니다.',
  duplicatedMenu: '중복된 메뉴가 존재합니다.',
});

const name = Object.freeze({
  inputView: 'inputViewError',
  menuBoard: 'menuBoard',
});

const ERROR = Object.freeze({
  message,
  name,
});

export default ERROR;
