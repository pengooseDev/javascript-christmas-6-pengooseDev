const input = Object.freeze({
  emptyString: '사용자의 입력이 없습니다.',
  notPositiveInteger: '양의 정수만 입력할 수 있습니다.',
});

const date = Object.freeze({
  invalidDate: '유효하지 않은 날짜입니다.',
});

const menuBoard = Object.freeze({
  invalidPrice: '유효하지 않은 가격입니다.',
  duplicatedMenu: '메뉴판 생성 중, 중복된 메뉴를 발견하였습니다.',
  menuNotFound: '유효하지 않은 주문입니다.',
});

const order = Object.freeze({
  invalidOrder: '유효하지 않은 주문입니다.',
  invalidQuantity: '유효하지 않은 주문입니다.',
  duplicatedOrder: '유효하지 않은 주문입니다.',
});

const message = Object.freeze({
  input,
  date,
  menuBoard,
  order,
});

const name = Object.freeze({
  inputView: 'inputViewError',
  menuBoard: 'menuBoard',
  orderService: 'orderService',
});

const ERROR = Object.freeze({
  message,
  name,
});

export default ERROR;
