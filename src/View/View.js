import MessageFormat from '../utils/messageFormat.js';
import InputView from './InputView.js';
import OutputView from './OutputView.js';

class View {
  #inputView = InputView;

  #outputView = OutputView;

  #messageFormat = MessageFormat;

  /**
   * 입력받는 데이터 형에 예외가 발생할 경우, 에러 메시지를 출력하고 다시 입력을 받습니다.
   * 직접적으로 도메인에 대한 검증을 실행하지 아니합니다.
   */
  async #reboundOnError(callback) {
    try {
      return await callback();
    } catch (error) {
      this.printReboundError(error);

      return this.#reboundOnError(callback);
    }
  }

  printReboundError(error) {
    const message = this.#messageFormat.reboundError(error);

    this.#outputView.print(message);
  }

  async readDate() {
    const date = await this.#reboundOnError(() => this.#inputView.readDate());

    return date;
  }

  async readOrder() {
    const menu = await this.#reboundOnError(() => this.#inputView.readOrder());

    return menu;
  }

  printGreetingByMonth(month) {
    const message = this.#messageFormat.greetingByMonth(month);

    this.#outputView.print(message);
  }

  printOrderResult({ reservationDate, bill, promotionData }) {
    const { month, date } = reservationDate;
    const { orderedMenus, totalPrice } = bill;
    const { totalDiscount, totalPromotion, badge } = promotionData;
    this.#printReservationDate({ month, date });
    this.#printBill(bill);
    // this.#printPromotions(promotionData);
    // this.#printTotalPrice({ totalPrice, totalDiscount });
    // this.#printPromotionBadge(badge);
  }

  #printReservationDate({ month, date }) {
    const message = MessageFormat.reservationDate({ month, date });

    this.#outputView.print(message);
  }

  #printBill(bill) {
    const { orderedMenus, totalPrice } = bill;

    this.#printOrderedMenus(orderedMenus);
  }

  #printOrderedMenus(orderedMenus) {
    const menus = orderedMenus.map(({ name, quantity }) =>
      this.#messageFormat.orderMenu({ name, quantity }),
    );
    const menuMessage = this.#messageFormat.concatArrayWithEndOfLine(menus);
    const message = this.#messageFormat.orderedMenus(menuMessage);

    this.#outputView.print(message);
  }
}

export default View;
