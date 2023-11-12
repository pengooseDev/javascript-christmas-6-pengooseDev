import MenuBoard from '../Model/MenuBoard.js';
import ERROR from '../constants/error.js';
import defaultMenus from '../constants/menu.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';

class OrderService {
  static #orderSeparator = ',';

  static #menuSeparator = '-';

  #menuBoard = new MenuBoard(defaultMenus);

  getBill(orders) {
    const parsedOrders = this.#parseOrders(orders);
    const orderedMenus = this.#getOrderedMenus(parsedOrders);
    const totalPrice = this.#getTotalPrice(parsedOrders);

    return { orderedMenus, totalPrice };
  }

  #getOrderedMenus(parsedOrders) {
    return parsedOrders.map(({ menuName, quantity }) => {
      const menu = this.#menuBoard.selectMenu(menuName);

      return { menu, quantity };
    });
  }

  #parseOrders(orders) {
    return orders
      .split(OrderService.#orderSeparator)
      .map((order) => this.#parseMenu(order));
  }

  #parseMenu(menu) {
    const [menuName, quantity] = menu.split(OrderService.#menuSeparator);
    this.#validateQuantity(quantity);
    const parsedCount = Number(quantity);

    return { menuName, quantity: parsedCount };
  }

  #getTotalPrice(parsedOrders) {
    return parsedOrders.reduce((acc, { menuName, quantity }) => {
      const { price } = this.#menuBoard.selectMenu(menuName);
      return acc + price * quantity;
    }, 0);
  }

  #validateQuantity(quantity) {
    if (!Validator.isPositiveInteger(quantity)) {
      throw CustomError.orderService(ERROR.message.invalidQuantity);
    }
  }
}

export default OrderService;