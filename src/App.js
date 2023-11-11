import EventPlanner from './Domain/EventPlanner.js';
import View from './View/View.js';

class App {
  #eventPlanner;

  #view = new View();

  async run() {
    this.#setDependencies();
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

  #setDependencies() {
    this.#eventPlanner = new EventPlanner();
  }

  async #reservationProcess() {
    const date = this.#view.readDate();
  }
}

export default App;
