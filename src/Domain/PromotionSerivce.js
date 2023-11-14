import Calendar from '../Model/Calendar.js';
import Promotion from '../Model/Promotion.js';
import CHRISTMAS_PROMOTION from '../constants/christmasPromotion.js';
import MENU from '../constants/menu.js';

class PromotionService {
  #promotions = {};

  constructor({ month, bill }) {
    const { totalPrice } = bill;

    if (CHRISTMAS_PROMOTION.threshold.minOrderPrice <= totalPrice) {
      const endDay = Calendar.getLastDay();

      this.#setDatePromotionEvents({ month, endDay, bill });
      this.#setBillPromotionEvents({ month, endDay, totalPrice });
    }
  }

  getPromotion({ month, date }) {
    const promotions = this.#checkPromotions(month, date);
    const totalPromotion = this.#getTotalPromotion(promotions);
    const totalDiscount = this.#getTotalDiscount(promotions);
    const badge = this.#getBadgePromotion(totalPromotion);

    return { promotions, totalDiscount, totalPromotion, badge };
  }

  #checkPromotions(month, date) {
    if (!this.#promotions[month]) return [];

    return this.#promotions[month][date] || [];
  }

  #getTotalDiscount(promotions) {
    return promotions.reduce((acc, { promotionType, reward }) => {
      if (promotionType === Promotion.promotionType.discount)
        return acc + reward;

      return acc;
    }, 0);
  }

  #getTotalPromotion(promotions) {
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

  #setDatePromotionEvents({ month, endDay, bill }) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setChristmasDiscount({ month, endDay: CHRISTMAS_PROMOTION.endDay });
    this.#setSpecialDiscount({ month, endDay });
    this.#setWeekDiscount({ bill, month, endDay });
  }

  #setBillPromotionEvents({ month, endDay, totalPrice }) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setServiceMenuPromotion({ month, endDay, totalPrice });
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
    const dessertQuantity = this.#getDessertQuantity(bill);

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

  #getDessertQuantity(bill) {
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
