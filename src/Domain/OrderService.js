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

  #validateParsedOrders(parsedOrders) {
    this.#validateMenus(parsedOrders);
    parsedOrders.forEach(({ quantity }) => this.#validateQuantity(quantity));
    // TODO: 주문한 카테고리들을 반환하는 메서드를 추가한다. 음료만 주문 시, 주문할 수 없습니다.
    // TODO: 메뉴는 한 번에 최대 20개까지(quatity의 최대합은 20개)만 주문할 수 있습니다.
  }

  #validateMenus(orderedMenus) {
    const menuNames = orderedMenus.map(({ menuName }) => menuName);

    this.#validateDuplicatedOrder(menuNames);
  }

  #validateDuplicatedOrder(menuNames) {
    if (new Set(menuNames).size !== menuNames.length) {
      throw CustomError.orderService(ERROR.message.order.duplicatedOrder);
    }
  }

  #validateDessertOnly(menuNames) {
    if (menuNames.every((menuName) => this.#menuBoard.isMain(menuName))) {
      throw CustomError.orderService(ERROR.message.order.dessertOnly);
    }
  }

  #validateQuantity(quantity) {
    if (!Validator.isPositiveInteger(quantity)) {
      throw CustomError.orderService(ERROR.message.order.invalidQuantity);
    }
  }
}

export default OrderService;
