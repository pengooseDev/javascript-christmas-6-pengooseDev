import Calendar from '../Model/Calendar.js';
import Promotion from '../Model/Promotion.js';

class PromotionService {
  #promotions = {};

  constructor({ month, totalPrice }) {
    this.#setDatePromotionEvents(month);
    this.#setBillPromotionEvents({ month, totalPrice });
  }

  getPromotion({ month, date }) {
    return this.#checkPromotions(month, date);
  }

  #checkPromotions(month, date) {
    return this.#promotions[month][date] || [];
  }

  #setDatePromotionEvents(month) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setChristmasDiscount({ month, lastDay: 25 });
    this.#setSpecialDiscount({ month, lastDay: 25 });
    this.#setWeekDiscount({ month, lastDay: 25 });
  }

  #setBillPromotionEvents({ month, totalPrice }) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setServiceMenuPromotion({ month, lastDay: 25, totalPrice });
    this.#setBadgePromotion({ month, lastDay: 25, totalPrice });
  }

  #setServiceMenuPromotion({ month, lastDay, totalPrice }) {
    this.#addPromotion({
      month,
      lastDay,
      option: () => Promotion.createServiceMenu(totalPrice),
    });
  }

  #setBadgePromotion({ month, lastDay, totalPrice }) {
    this.#addPromotion({
      month,
      lastDay,
      option: () => Promotion.createBadge(totalPrice),
    });
  }

  #addPromotion({ month, lastDay, option }) {
    Array.from({ length: lastDay }, (_, index) => index + 1).forEach((day) => {
      const promotion = option(month, day);

      if (promotion) {
        this.#promotions[month][day] = this.#promotions[month][day] || [];
        this.#promotions[month][day].push(promotion);
      }
    });
  }

  #setChristmasDiscount({ month, lastDay }) {
    this.#addPromotion({
      month,
      lastDay,
      option: (_, day) => Promotion.createChristmasDiscount(day),
    });
  }

  #setSpecialDiscount({ month, lastDay }) {
    this.#addPromotion({
      month,
      lastDay,
      option: (m, d) =>
        Calendar.isSunday(m, d) || Calendar.isChristmas(m, d)
          ? Promotion.createSpecialDiscount()
          : null,
    });
  }

  #getWeekDiscountPromotion(month, day) {
    return Calendar.isWeekend(month, day)
      ? Promotion.createWeekendDiscount()
      : Promotion.createWeekdayDiscount();
  }

  #setWeekDiscount({ month, lastDay }) {
    this.#addPromotion({
      month,
      lastDay,
      option: (m, d) => this.#getWeekDiscountPromotion(m, d),
    });
  }
}

export default PromotionService;
