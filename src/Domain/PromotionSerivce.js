import Calendar from '../Model/Calendar.js';
import Promotion from '../Model/Promotion.js';
import CHRISTMAS_PROMOTION from '../constants/christmasPromotion.js';
import MENU from '../constants/menu.js';

class PromotionService {
  #promotions = {};

  constructor({ month, totalPrice, bill }) {
    if (CHRISTMAS_PROMOTION.threshold.minOrderPrice > totalPrice) return;

    this.#setDatePromotionEvents({ month, bill });
    this.#setBillPromotionEvents({ month, totalPrice });
  }

  getPromotion({ month, date }) {
    const promotions = this.#checkPromotions(month, date);
    const totalDiscount = this.#getTotalDiscount(promotions);
    const badge = this.#getBadgePromotion(totalDiscount);

    return { promotions, totalDiscount, badge };
  }

  #checkPromotions(month, date) {
    if (!this.#promotions[month]) return [];

    return this.#promotions[month][date] || [];
  }

  #getTotalDiscount(promotions) {
    return promotions.reduce((acc, { promotionType, reward }) => {
      if (promotionType === Promotion.promotionType.discount)
        return acc + reward;
      if (promotionType === Promotion.promotionType.serviceMenu)
        return acc + reward.value;

      return acc;
    }, 0);
  }

  #getBadgePromotion(totalDiscount) {
    return Promotion.createBadge(totalDiscount);
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
