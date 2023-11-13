import Calendar from '../Model/Calendar.js';
import Promotion from '../Model/Promotion.js';
import MENU from '../constants/menu.js';

class PromotionService {
  #promotions = {};

  constructor({ month, totalPrice, bill }) {
    this.#setDatePromotionEvents({ month, bill });
    this.#setBillPromotionEvents({ month, totalPrice });
  }

  getPromotion({ month, date }) {
    return this.#checkPromotions(month, date);
  }

  #checkPromotions(month, date) {
    return this.#promotions[month][date] || [];
  }

  #setDatePromotionEvents({ month, bill }) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setChristmasDiscount({ month, endDay: 25 });
    this.#setSpecialDiscount({ month, endDay: 31 });
    this.#setWeekDiscount({ bill, month, endDay: 31 });
  }

  #setBillPromotionEvents({ month, totalPrice }) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setServiceMenuPromotion({ month, endDay: 31, totalPrice });
    this.#setBadgePromotion({ month, endDay: 31, totalPrice });
  }

  #addPromotion({ month, endDay, option }) {
    Array.from({ length: endDay }, (_, index) => index + 1).forEach((day) => {
      const promotion = option(month, day);

      if (promotion) {
        this.#promotions[month][day] = this.#promotions[month][day] || [];
        this.#promotions[month][day].push(promotion);
      }
    });
  }

  #setServiceMenuPromotion({ month, endDay, totalPrice }) {
    this.#addPromotion({
      month,
      endDay,
      option: () => Promotion.createServiceMenu(totalPrice),
    });
  }

  // FIXME: 총 구매액이 아닌 총혜택으로 확인해야함.
  #setBadgePromotion({ month, endDay, totalPrice }) {
    this.#addPromotion({
      month,
      endDay,
      option: () => Promotion.createBadge(totalPrice),
    });
  }

  #setChristmasDiscount({ month, endDay }) {
    this.#addPromotion({
      month,
      endDay,
      option: (_, day) => Promotion.createChristmasDiscount(day),
    });
  }

  #setSpecialDiscount({ month, endDay }) {
    this.#addPromotion({
      month,
      endDay,
      option: (m, d) =>
        Calendar.isSunday(m, d) || Calendar.isChristmas(m, d)
          ? Promotion.createSpecialDiscount()
          : null,
    });
  }

  #getWeekDiscountPromotion({ month, day, bill }) {
    const { mainQuantity, dessertQuantity } = this.#getCategoryQuantity(bill);

    return Calendar.isWeekend(month, day)
      ? Promotion.createWeekendDiscount(mainQuantity)
      : Promotion.createWeekdayDiscount(dessertQuantity);
  }

  #getCategoryQuantity(bill) {
    const mainQuantity = this.#getMainQuantity(bill);
    const dessertQuantity = this.#getDessertQuatity(bill);

    return { mainQuantity, dessertQuantity };
  }

  #getMainQuantity(bill) {
    const mainMenus = bill.orderedMenus.reduce(
      (acc, { category, quantity }) => {
        return category === MENU.category.main ? acc + quantity : acc;
      },
      0,
    );

    return mainMenus;
  }

  #getDessertQuatity(bill) {
    const dessertMenus = bill.orderedMenus.reduce(
      (acc, { category, quantity }) => {
        return category === MENU.category.dessert ? acc + quantity : acc;
      },
      0,
    );

    return dessertMenus;
  }

  #setWeekDiscount({ bill, month, endDay }) {
    this.#addPromotion({
      month,
      endDay,
      option: (m, d) =>
        this.#getWeekDiscountPromotion({ month: m, day: d, bill }),
    });
  }
}

export default PromotionService;
