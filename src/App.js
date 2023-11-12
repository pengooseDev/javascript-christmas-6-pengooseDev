import View from './View/View.js';
import Calander from './Model/Calendar.js';
import OrderService from './Domain/OrderService.js';
import defaultMenus from './constants/menu.js';
import PromotionService from './Domain/PromotionSerivce.js';

class App {
  #orderService = new OrderService(defaultMenus);

  #promotionService;

  #view = new View();

  async run() {
    const reservationDate = await this.#reservationProcess();
    const bill = await this.#reboundOnError(() => this.#orderProcess());
    const promotions = this.#promotionProcess({ reservationDate, bill });

    console.log(promotions);
  }

  /**
   * 각 객체에서 전달받은 에러를 처리합니다.
   * ViewLayer에서 처리하지 못한 타입 이외의 에러를 처리합니다.
   */
  async #reboundOnError(callback) {
    try {
      return await callback();
    } catch (error) {
      this.#view.printReboundError(error);

      return this.#reboundOnError(callback);
    }
  }

  async #reservationProcess() {
    const month = Calander.getMonth();

    this.#view.printGreetingByMonth(month);
    const date = await this.#view.readDate(month);

    return { month, date };
  }

  async #orderProcess() {
    const order = await this.#view.readOrder();

    return this.#orderService.getBill(order);
  }

  #promotionProcess({ reservationDate, bill }) {
    const { month, date } = reservationDate;
    const { totalPrice } = bill;
    this.#promotionService = new PromotionService({ month, totalPrice });
    return this.#promotionService.getPromotion({
      month,
      date,
      bill,
    });
  }
}

export default App;
