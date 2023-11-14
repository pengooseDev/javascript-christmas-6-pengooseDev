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
    this.#printDiscountedPrice({ bill, promotionData });
    this.#printPromotionBadge({
      month: reservationDate.month,
      badge: promotionData.badge?.reward || MESSAGE.print.none,
    });
  }

  #printPromotionBadge({ month, badge }) {
    this.#optionalRender({
      option: badge !== null,
      onTrue: this.#messageFormat.promotionBadge({ month, badge }),
      onFalse: this.#messageFormat.promotionBadge({ month, badge }),
    });
  }

  #printDiscountedPrice({ bill, promotionData }) {
    const { totalPrice } = bill;
    const { totalDiscount } = promotionData;

    const discountedPrice = totalPrice - totalDiscount;
    const message = this.#messageFormat.discountedPrice(discountedPrice);

    this.#outputView.print(message);
  }

  #printPromotions(promotionData) {
    const { promotions, totalPromotion } = promotionData;

    this.#printServiceMenu(promotions);
    this.#printPromotionList(promotions);
    this.#printTotalPromotion(totalPromotion);
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

  #getServiceMenus(promotions) {
    const serviceMenus = promotions.filter(
      ({ promotionType }) =>
        promotionType === Promotion.promotionType.serviceMenu,
    );

    return serviceMenus;
  }

  #printServiceMenu(promotions) {
    const serviceMenus = this.#getServiceMenus(promotions);
    const parsedMessage = this.#parseServiceMenuMessage(serviceMenus);

    this.#optionalRender({
      option: serviceMenus.length,
      onTrue: this.#messageFormat.serviceMenu(parsedMessage),
      onFalse: this.#messageFormat.serviceMenu(MESSAGE.print.none),
    });
  }

  #parseServiceMenuMessage(serviceMenus) {
    const parsedServices = serviceMenus.map(({ reward: { name, quantity } }) =>
      this.#messageFormat.concatNameWithQuantity({ name, quantity }),
    );

    return this.#messageFormat.concatArrayWithEndOfLine(parsedServices);
  }

  #printPromotionList(promotions) {
    const parsedMessage = this.#parsePromotionMessage(promotions);

    this.#optionalRender({
      option: promotions.length,
      onTrue: this.#messageFormat.promotionList(parsedMessage),
      onFalse: this.#messageFormat.promotionList(MESSAGE.print.none),
    });
  }

  #parsePromotionMessage(promotions) {
    const parsedPromotions = promotions
      .map(this.#parsePromotionType)
      .map(({ name, reward }) =>
        this.#messageFormat.concatNameWithReward({ name, reward }),
      );

    return this.#messageFormat.concatArrayWithEndOfLine(parsedPromotions);
  }

  #parsePromotionType({ promotionType, promotionName, reward }) {
    if (promotionType === Promotion.promotionType.serviceMenu) {
      return { name: promotionName, reward: reward.value * reward.quantity };
    }

    return { name: promotionName, reward };
  }

  #printTotalPromotion(totalPromotion) {
    const message = this.#messageFormat.totalPromotion(totalPromotion);

    this.#outputView.print(message);
  }
}

export default View;
