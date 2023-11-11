import View from './View/View.js';

class App {
  #view = new View();

  async run() {
    await this.#view.readDate();
  }
}

export default App;
