import CHRISTMAS_PROMOTION from '../constants/christmasPromotion.js';

class Promotion {
  static promotionType = Object.freeze({
    discount: 'discount',
    dessertDiscount: 'dessertDiscount',
    mainDiscount: 'mainDiscount',
    serviceMenu: 'serviceMenu',
    badge: 'badge',
  });

  static #billThreshold = Object.freeze({
    totalPrice: 120_000,
    santa: 20_000,
    tree: 10_000,
    star: 5_000,
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

  // FIXME: 메뉴가 메인메뉴인 것만 골라서 모든 메인메뉴만 중복할인
  static createWeekdayDiscount() {
    return new Promotion({
      promotionType: this.promotionType.dessertDiscount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.weekday,
      reward: CHRISTMAS_PROMOTION.dateDiscount.weekday,
    });
  }

  // FIXME: 메뉴가 메인메뉴인 것만 골라서 모든 디저트메뉴만 중복할인
  static createWeekendDiscount() {
    return new Promotion({
      promotionType: this.promotionType.mainDiscount,
      promotionName: CHRISTMAS_PROMOTION.promotionName.weekend,
      reward: CHRISTMAS_PROMOTION.dateDiscount.weekend,
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
    if (totalPrice < this.#billThreshold.totalPrice) return null;

    return new Promotion({
      promotionName: CHRISTMAS_PROMOTION.promotionName.serviceMenu,
      promotionType: this.promotionType.serviceMenu,
      reward: CHRISTMAS_PROMOTION.serviceMenu,
    });
  }
}

export default Promotion;
