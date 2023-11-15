import CHRISTMAS_PROMOTION from '../constants/christmasPromotion.js';
import ERROR from '../constants/error.js';
import CustomError from '../errors/error.js';
import Validator from '../utils/Validator.js';
import Calendar from './Calendar.js';

class Promotion {
  static promotionType = Object.freeze({
    discount: 'discount',
    serviceMenu: 'serviceMenu',
    badge: 'badge',
  });

  constructor({ promotionName, reward, promotionType }) {
    this.promotionName = promotionName;
    this.promotionType = promotionType;
    this.reward = reward;
  }

  static createChristmasDiscount(day) {
    this.#validateDay(day);
    const discount = this.#getChristmasDiscount(day);

    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.christmas,
      reward: discount,
    });
  }

  static createWeekdayDiscount(quantity) {
    this.#validateQuantity(quantity);

    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.weekday,
      reward: CHRISTMAS_PROMOTION.dateDiscount.weekday * quantity,
    });
  }

  static createWeekendDiscount(quantity) {
    this.#validateQuantity(quantity);

    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.weekend,
      reward: CHRISTMAS_PROMOTION.dateDiscount.weekend * quantity,
    });
  }

  static createSpecialDiscount() {
    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.special,
      reward: CHRISTMAS_PROMOTION.dateDiscount.special,
    });
  }

  static #checkBadge(totalDiscount) {
    if (totalDiscount >= CHRISTMAS_PROMOTION.threshold.santa)
      return CHRISTMAS_PROMOTION.badge.santa;
    if (totalDiscount >= CHRISTMAS_PROMOTION.threshold.tree)
      return CHRISTMAS_PROMOTION.badge.tree;
    if (totalDiscount >= CHRISTMAS_PROMOTION.threshold.star)
      return CHRISTMAS_PROMOTION.badge.star;

    return null;
  }

  static createBadge(totalDiscount) {
    const badge = this.#checkBadge(totalDiscount);

    return new Promotion({
      promotionType: this.promotionType.badge,
      promotionName: CHRISTMAS_PROMOTION.promotionName.badge,
      reward: badge,
    });
  }

  static createServiceMenu(totalPrice) {
    if (totalPrice < CHRISTMAS_PROMOTION.threshold.totalPrice) return null;

    return new Promotion({
      promotionType: this.promotionType.serviceMenu,
      promotionName: CHRISTMAS_PROMOTION.promotionName.serviceMenu,
      reward: CHRISTMAS_PROMOTION.serviceMenu,
    });
  }

  static #validateDay(day) {
    if (
      !Validator.isPositiveInteger(day) ||
      !Validator.isInRange(day, Calendar.initialDay, Calendar.maxDay)
    ) {
      throw CustomError.promotion(ERROR.message.invalidDay);
    }
  }

  static #validateQuantity(quantity) {
    if (!Validator.isPositiveInteger(quantity) && quantity !== 0) {
      throw CustomError.promotion(ERROR.message.promotion.invalidQuantity);
    }
  }

  static #getChristmasDiscount(day) {
    return (
      CHRISTMAS_PROMOTION.dateDiscount.christmasDefault +
      CHRISTMAS_PROMOTION.dateDiscount.christmasDdayUnit * (day - 1)
    );
  }
}

export default Promotion;
