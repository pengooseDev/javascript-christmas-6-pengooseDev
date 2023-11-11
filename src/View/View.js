import InputView from './InputView.js';
import OutputView from './OutputView.js';

class View {
  #inputView = InputView;

  #outputView = OutputView;

  /**
   * 입력받는 데이터 형에 예외가 발생할 경우, 에러 메시지를 출력하고 다시 입력을 받습니다.
   * 직접적으로 도메인에 대한 검증을 실행하지 아니합니다.
   */
  async #reboundOnError(callback) {
    try {
      return await callback();
    } catch (error) {
      this.#outputView.printReboundError(error);

      return this.#reboundOnError(callback);
    }
  }

  async readDate() {
    const date = await this.#reboundOnError(() => this.#inputView.readDate());

    return date;
  }

  printGreetingByMonth(month) {
    this.#outputView.printGreetingByMonth(month);
  }
}

export default View;
