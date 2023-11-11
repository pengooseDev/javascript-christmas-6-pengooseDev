import ERROR from '../constants/error.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';

class MenuBoard {
  #menus = new Map();

  constructor(menus) {
    this.#validate(menus);

    menus.forEach(({ category, name, price }) => {
      this.#menus.set(name, { category, name, price });
    });
  }

  selectMenu(name) {
    this.#checkMenuExistence(name);

    return { ...this.#menus.get(name) };
  }

  getMenuBoard() {
    const menuCategory = {};
    this.#menus.forEach(({ category, price }, name) => {
      menuCategory[category] ||= [];
      menuCategory[category].push({ name, price });
    });

    return menuCategory;
  }

  #checkMenuExistence(name) {
    if (!this.#menus.has(name)) {
      throw CustomError.menuBoard(ERROR.message.menuNotFound);
    }
  }

  #validate(menus) {
    this.#checkDuplicatedMenu(menus);
    this.#checkValidPrice(menus);
  }

  #findDuplicateName(names) {
    const duplicatedName = names.find((name, index) => {
      return names.indexOf(name) !== index;
    });

    return duplicatedName;
  }

  #checkDuplicatedMenu(menus) {
    const names = menus.map(({ name }) => name);
    if (new Set(names).size !== names.length) {
      throw CustomError.menuBoard(
        `${ERROR.message.duplicatedMenu} ${this.#findDuplicateName(names)}`,
      );
    }
  }

  #checkValidPrice(menus) {
    const prices = menus.map(({ price }) => price);
    const isAllPositiveInteger = prices.every(Validator.isPositiveInteger);

    if (!isAllPositiveInteger) {
      throw CustomError.menuBoard(ERROR.message.invalidPrice);
    }
  }
}

export default MenuBoard;
