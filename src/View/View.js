import Promotion from '../Model/Promotion.js';
import MESSAGE from '../constants/message.js';
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
    this.#printReservationDate(reservationDate);
    this.#printBill(bill);
    this.#printPromotions(promotionData);
    // this.#printTotalPrice({ totalPrice, totalDiscount });
    // this.#printPromotionBadge(badge);
  }

  #printPromotions(promotionData) {
    const { promotions, totalDiscount, totalPromotion, badge } = promotionData;
    const serviceMenus = promotions.filter(
      ({ promotionType }) =>
        promotionType === Promotion.promotionType.serviceMenu,
    );

    this.#printServiceMenu(serviceMenus);
  }

  #printReservationDate(reservationDate) {
    const { month, date } = reservationDate;
    const message = MessageFormat.reservationDate({ month, date });

    this.#outputView.print(message);
  }

  #printBill(bill) {
    const { orderedMenus, totalPrice } = bill;

    this.#printOrderedMenus(orderedMenus);
    this.#printTotalPrice(totalPrice);
  }

  #printOrderedMenus(orderedMenus) {
    const menus = orderedMenus.map(({ name, quantity }) =>
      this.#messageFormat.concatNameWithQuantity({ name, quantity }),
    );
    const menuMessage = this.#messageFormat.concatArrayWithEndOfLine(menus);
    const message = this.#messageFormat.orderedMenus(menuMessage);

    this.#outputView.print(message);
  }

  #printTotalPrice(totalPrice) {
    const message = this.#messageFormat.totalPrice(totalPrice);

    this.#outputView.print(message);
  }

  #optionalRender({ option, onTrue, onFalse }) {
    if (!option) return this.#outputView.print(onFalse);

    return this.#outputView.print(onTrue);
  }

  #printServiceMenu(serviceMenus) {
    const servicesMessage = this.#parseServiceMenuMessage(serviceMenus);

    this.#optionalRender({
      option: serviceMenus.length,
      onTrue: this.#messageFormat.serviceMenu(servicesMessage),
      onFalse: this.#messageFormat.serviceMenu(MESSAGE.print.none),
    });
  }

  #parseServiceMenuMessage(serviceMenus) {
    const services = serviceMenus.map(({ reward: { name, quantity } }) =>
      this.#messageFormat.concatNameWithQuantity({ name, quantity }),
    );

    return this.#messageFormat.concatArrayWithEndOfLine(services);
  }
}

export default View;
