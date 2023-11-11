import { Console } from '@woowacourse/mission-utils';

const OutputView = {
  printMenu() {
    Console.print('<주문 메뉴>');
  },

  printError(message) {
    Console.print(`${message}\n`);
  },

  printReboundError(error) {
    Console.print(`${error} 다시 입력해 주세요.\n`);
  },
};

export default OutputView;
