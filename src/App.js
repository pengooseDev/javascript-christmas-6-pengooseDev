import EventPlanner from './Domain/EventPlanner.js';
import View from './View/View.js';
import Calander from './Model/Calander.js';

class App {
  #eventPlanner = new EventPlanner();

  #view = new View();

  async run() {
    await this.#reservationProcess();
  }

  async #reboundOnError(callback) {
    try {
      return callback();
    } catch (error) {
      this.#view.printReboundError(error.message);

      return this.#reservationProcess();
    }
  }

  async #reservationProcess() {
    const currenMonth = Calander.getMonth();

    this.#view.printGreetingByMonth(currenMonth);
    const date = await this.#view.readDate(currenMonth);
    const order = await this.#view.readOrder();
  }
}

export default App;
