import MenuBoard from '../Model/MenuBoard.js';
import ERROR from '../constants/error.js';
import MENU from '../constants/menu.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';

class OrderService {
  static #orderSeparator = ',';

  static #menuSeparator = '-';

  static #menuFormLength = 2;

  #menuBoard;

  constructor(menus = MENU.defaultMenus) {
    this.#menuBoard = new MenuBoard(menus);
  }

  getBill(orders) {
    const parsedOrders = this.#parseOrders(orders);
    this.#validateParsedOrders(parsedOrders);
    const orderedMenus = this.#getOrderedMenus(parsedOrders);
    const totalPrice = this.#getTotalPrice(orderedMenus);

    return { orderedMenus, totalPrice };
  }

  #getTotalPrice(orderedMenus) {
    return orderedMenus.reduce(
      (totalPrice, { price, quantity }) => totalPrice + price * quantity,
      0,
    );
  }

  #getOrderedMenus(parsedOrders) {
    return parsedOrders.map(({ menuName, quantity }) => {
      const menu = this.#menuBoard.selectMenu(menuName);

      return { ...menu, quantity };
    });
  }

  #parseOrders(orders) {
    this.#validateOrdersForm(orders);

    return orders
      .split(OrderService.#orderSeparator)
      .map((order) => this.#parseMenu(order));
  }

  #validateOrdersForm(orders) {
    const isValid = Validator.isValidArray({
      value: orders,
      separator: OrderService.#orderSeparator,
    });

    if (!isValid)
      throw CustomError.orderService(ERROR.message.order.invalidOrder);
  }

  #validateMenuForm(menu) {
    const isValid = Validator.isValidArray({
      value: menu,
      separator: OrderService.#menuSeparator,
      length: OrderService.#menuFormLength,
    });

    if (!isValid)
      throw CustomError.orderService(ERROR.message.order.invalidOrder);
  }

  #parseMenu(menu) {
    this.#validateMenuForm(menu);

    const [menuName, quantity] = menu.split(OrderService.#menuSeparator);
    const parsedCount = Number(quantity);

    return { menuName, quantity: parsedCount };
  }

  #validateParsedOrders(parsedOrders) {
    this.#validateMenus(parsedOrders);
    parsedOrders.forEach(({ quantity }) => this.#validateQuantity(quantity));
    this.#validateTotalQuantity(parsedOrders);
  }

  #validateTotalQuantity(parsedOrders) {
    const totalQuantity = parsedOrders.reduce(
      (acc, { quantity }) => acc + quantity,
      0,
    );

    if (totalQuantity > MENU.threshold.quatity) {
      throw CustomError.orderService(ERROR.message.order.invalidQuantity);
    }
  }

  #validateMenus(orderedMenus) {
    const menuNames = orderedMenus.map(({ menuName }) => menuName);

    this.#validateDuplicatedOrder(menuNames);
    this.#validateOnlyDrink(menuNames);
  }

  #validateDuplicatedOrder(menuNames) {
    if (new Set(menuNames).size !== menuNames.length) {
      throw CustomError.orderService(ERROR.message.order.duplicatedOrder);
    }
  }

  #validateOnlyDrink(menuNames) {
    const drinkCount = menuNames.filter((name) => {
      return MENU.category.drink === this.#menuBoard.getCategory(name);
    }).length;

    if (drinkCount === menuNames.length) {
      throw CustomError.orderService(ERROR.message.order.onlyDrink);
    }
  }

  #validateQuantity(quantity) {
    if (!Validator.isPositiveInteger(quantity)) {
      throw CustomError.orderService(ERROR.message.order.invalidQuantity);
    }
  }
}

export default OrderService;
