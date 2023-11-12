// TODO: 메시지가 점점 많아지는 것 같은데, 일단 코드를 작성하고 메시지 상수로 분리하기!
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
  duplicatedMenu: '메뉴판 생성 중, 중복된 메뉴를 발견하였습니다.',

  // order
  invalidOrder: '유효하지 않은 주문입니다.',
  invalidQuantity: '유효하지 않은 주문입니다.',
  duplicatedOrder: '유효하지 않은 주문입니다.',
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
