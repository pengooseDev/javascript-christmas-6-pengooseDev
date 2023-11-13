import MenuBoard from '../Model/MenuBoard.js';
import ERROR from '../constants/error.js';
import DEFAULT_MENUS from '../constants/menu.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';

class OrderService {
  static #orderSeparator = ',';

  static #menuSeparator = '-';

  static #menuFormLength = 2;

  #menuBoard;

  constructor(menus = DEFAULT_MENUS) {
    this.#menuBoard = new MenuBoard(menus);
  }

  getBill(orders) {
    const parsedOrders = this.#parseOrders(orders);
    this.#validateParsedOrders(parsedOrders);

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
    this.#validateOrders(orders);

    return orders
      .split(OrderService.#orderSeparator)
      .map((order) => this.#parseMenu(order));
  }

  #validateOrders(orders) {
    const isValid = Validator.isValidArray({
      value: orders,
      separator: OrderService.#orderSeparator,
    });

    if (!isValid)
      throw CustomError.orderService(ERROR.message.order.invalidOrder);
  }

  #validateMenu(menu) {
    const isValid = Validator.isValidArray({
      value: menu,
      separator: OrderService.#menuSeparator,
      length: OrderService.#menuFormLength,
    });

    if (!isValid)
      throw CustomError.orderService(ERROR.message.order.invalidOrder);
  }

  #parseMenu(menu) {
    this.#validateMenu(menu);

    const [menuName, quantity] = menu.split(OrderService.#menuSeparator);
    const parsedCount = Number(quantity);

    return { menuName, quantity: parsedCount };
  }

  #getTotalPrice(parsedOrders) {
    return parsedOrders.reduce((acc, { menuName, quantity }) => {
      const { price } = this.#menuBoard.selectMenu(menuName);

      return acc + price * quantity;
    }, 0);
  }

  #validateParsedOrders(parsedOrders) {
    const orderedMenus = parsedOrders.map(({ menuName }) => menuName);
    if (new Set(orderedMenus).size !== orderedMenus.length) {
      throw CustomError.orderService(ERROR.message.order.duplicatedOrder);
    }

    parsedOrders.forEach(({ quantity }) => this.#validateQuantity(quantity));
  }

  #validateQuantity(quantity) {
    if (!Validator.isPositiveInteger(quantity)) {
      throw CustomError.orderService(ERROR.message.order.invalidQuantity);
    }
  }
}

export default OrderService;
