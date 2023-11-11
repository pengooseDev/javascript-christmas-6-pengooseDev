import InputView from './InputView.js';
import OutputView from './OutputView.js';

class View {
  #inputView = InputView;

  #outputView = OutputView;

  /**
   * 입력받는 데이터 형에 예외가 발생할 경우, 에러 메시지를 출력하고 다시 입력을 받습니다.
   * 직접적으로 도메인에 대한 검증을 실행하지 아니합니다.
   */
  async #retryOnInputError(callback) {
    try {
      return await callback();
    } catch (error) {
      this.#outputView.printReboundError(error);

      return this.#retryOnInputError(callback);
    }
  }

  async readDate() {
    const date = await this.#retryOnInputError(() =>
      this.#inputView.readDate(),
    );

    return date;
  }
}

export default View;
