import Calendar from '../Model/Calendar.js';
import Promotion from '../Model/Promotion.js';

class PromotionService {
  #promotions = {};

  constructor({ month, totalPrice }) {
    this.#setDatePromotionEvents(month); // FIXME: 1. bill 넘겨야함.
    this.#setBillPromotionEvents({ month, totalPrice });
  }

  getPromotion({ month, date }) {
    return this.#checkPromotions(month, date);
  }

  #checkPromotions(month, date) {
    return this.#promotions[month][date] || [];
  }

  // FIXME: 2. bill 넘겨야함.
  #setDatePromotionEvents(month) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setChristmasDiscount({ month, endDay: 25 });
    this.#setSpecialDiscount({ month, endDay: 31 });
    this.#setWeekDiscount({ month, endDay: 31 }); // FIXME: 3. bill 넘겨야함.
  }

  #setBillPromotionEvents({ month, totalPrice }) {
    this.#promotions[month] = this.#promotions[month] || {};

    this.#setServiceMenuPromotion({ month, endDay: 31, totalPrice });
    this.#setBadgePromotion({ month, endDay: 31, totalPrice });
  }

  #setServiceMenuPromotion({ month, endDay, totalPrice }) {
    this.#addPromotion({
      month,
      endDay,
      option: () => Promotion.createServiceMenu(totalPrice),
    });
  }

  #setBadgePromotion({ month, endDay, totalPrice }) {
    this.#addPromotion({
      month,
      endDay,
      option: () => Promotion.createBadge(totalPrice),
    });
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

  // FIXME: 5. bill 넘겨야함.
  #getWeekDiscountPromotion(month, day) {
    return Calendar.isWeekend(month, day)
      ? Promotion.createWeekendDiscount()
      : Promotion.createWeekdayDiscount();
  }

  #setWeekDiscount({ month, endDay }) {
    this.#addPromotion({
      month,
      endDay,
      // FIXME: 4. bill 넘겨야함.
      option: (m, d) => this.#getWeekDiscountPromotion(m, d),
    });
  }
}

export default PromotionService;
