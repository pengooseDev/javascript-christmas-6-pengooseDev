import CHRISTMAS_PROMOTION from '../constants/christmasPromotion.js';

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
    const discount =
      CHRISTMAS_PROMOTION.dateDiscount.christmasDefault +
      CHRISTMAS_PROMOTION.dateDiscount.christmasDdayUnit * (day - 1);
    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.christmas,
      reward: discount,
    });
  }

  static createWeekdayDiscount(quatity) {
    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.weekday,
      reward: CHRISTMAS_PROMOTION.dateDiscount.weekday * quatity,
    });
  }

  static createWeekendDiscount(quatity) {
    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.weekend,
      reward: CHRISTMAS_PROMOTION.dateDiscount.weekend * quatity,
    });
  }

  static createSpecialDiscount() {
    return new Promotion({
      promotionType: this.promotionType.discount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.special,
      reward: CHRISTMAS_PROMOTION.dateDiscount.special,
    });
  }

  static #checkBadge(totalPrice) {
    if (totalPrice >= CHRISTMAS_PROMOTION.billThreshold.santa)
      return CHRISTMAS_PROMOTION.badge.santa;
    if (totalPrice >= CHRISTMAS_PROMOTION.billThreshold.tree)
      return CHRISTMAS_PROMOTION.badge.tree;
    if (totalPrice >= CHRISTMAS_PROMOTION.billThreshold.star)
      return CHRISTMAS_PROMOTION.badge.star;

    return null;
  }

  static createBadge(totalPrice) {
    const badge = this.#checkBadge(totalPrice);
    if (!badge) return null;

    return new Promotion({
      promotionType: this.promotionType.badge,
      promotionName: CHRISTMAS_PROMOTION.promotionName.badge,
      reward: badge,
    });
  }

  static createServiceMenu(totalPrice) {
    if (totalPrice < CHRISTMAS_PROMOTION.billThreshold.totalPrice) return null;

    return new Promotion({
      promotionType: this.promotionType.serviceMenu,
      promotionName: CHRISTMAS_PROMOTION.promotionName.serviceMenu,
      reward: CHRISTMAS_PROMOTION.serviceMenu,
    });
  }
}

export default Promotion;
