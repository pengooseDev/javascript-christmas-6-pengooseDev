import View from './View/View.js';
import Calander from './Model/Calendar.js';
import OrderService from './Domain/OrderService.js';

class App {
  #orderService = new OrderService();

  #view = new View();

  async run() {
    await this.#reservationProcess();
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
    const currenMonth = Calander.getMonth();

    this.#view.printGreetingByMonth(currenMonth);
    const date = await this.#view.readDate(currenMonth);
    const bill = await this.#reboundOnError(() => this.#orderProcess());
  }

  async #orderProcess() {
    const order = await this.#view.readOrder();
    const bill = this.#orderService.getBill(order);

    return bill;
  }
}

export default App;
