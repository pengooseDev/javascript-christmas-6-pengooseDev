import EventPlanner from './Domain/EventPlanner.js';
import View from './View/View.js';

class App {
  #eventPlanner = new EventPlanner();

  #view = new View();

  async run() {
    await this.#reservationProcess();
  }

  #reboundOnError(callback) {
    try {
      callback();
    } catch (error) {
      this.#view.alertError(error.message);
      this.#reservationProcess();
    }
  }

  async #reservationProcess() {
    const month = new Date().getMonth() + 1;

    this.#view.printGreetingByMonth(month);
    const date = this.#view.readDate();
  }
}

export default App;
