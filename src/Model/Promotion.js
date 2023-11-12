class Promotion {
  static promotionType = Object.freeze({
    discount: 'discount',
    dessertDiscount: 'dessertDiscount',
    mainDiscount: 'mainDiscount',
    serviceMenu: 'serviceMenu',
    badge: 'badge',
  });

  static #date = Object.freeze({
    christmas: 1_000,
    christmasDdayUnit: 100,
    weekday: 2_023,
    weekend: 2_023,
    special: 1_000,
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
      this.#date.christmas + this.#date.christmasDdayUnit * (day - 1);
    return new Promotion({
      promotionName: '크리스마스 디데이 할인',
      promotionType: this.promotionType.discount,
      reward: discount,
    });
  }

  static createWeekdayDiscount() {
    return new Promotion({
      promotionName: '평일 할인',
      promotionType: this.promotionType.dessertDiscount,
      reward: this.#date.weekday,
    });
  }

  static createWeekendDiscount() {
    return new Promotion({
      promotionName: '주말 할인',
      promotionType: this.promotionType.mainDiscount,
      reward: this.#date.weekend,
    });
  }

  static createSpecialDiscount() {
    return new Promotion({
      promotionName: '특별 할인',
      promotionType: this.promotionType.discount,
      reward: this.#date.special,
    });
  }

  static #checkBadge(totalPrice) {
    if (totalPrice >= this.#billThreshold.santa) return '산타';
    if (totalPrice >= this.#billThreshold.tree) return '트리';
    if (totalPrice >= this.#billThreshold.star) return '별';

    return null;
  }

  static createBadge(totalPrice) {
    const badge = this.#checkBadge(totalPrice);
    if (!badge) return null;

    return new Promotion({
      promotionName: '할인 배지',
      promotionType: this.promotionType.badge,
      reward: badge,
    });
  }

  static createServiceMenu(totalPrice) {
    if (totalPrice < this.#billThreshold.totalPrice) return null;

    return new Promotion({
      promotionName: '증정 이벤트',
      promotionType: this.promotionType.serviceMenu,
      reward: '샴페인', // TODO: Menu에서 매핑하여 가격 가져와야 함.
    });
  }
}

export default Promotion;
