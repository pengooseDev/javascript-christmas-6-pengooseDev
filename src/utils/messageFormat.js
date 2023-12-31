const MessageFormat = {
  error(message) {
    return `[ERROR] ${message}`;
  },

  concatArrayWithEndOfLine(array) {
    return array.join('\n');
  },

  reboundError(message) {
    return `${message} 다시 입력해 주세요.\n`;
  },

  greetingByMonth(month) {
    return `안녕하세요! 우테코 식당 ${month}월 이벤트 플래너입니다.`;
  },

  reservationDate({ month, date }) {
    return `${month}월 ${date}일에 우테코 식당에서 받을 이벤트 혜택 미리 보기!\n`;
  },

  concatNameWithQuantity({ name, quantity }) {
    return `${name} ${quantity}개`;
  },

  concatNameWithReward({ name, reward }) {
    const formattedReward = this.formatMoney(reward);

    return `${name}: -${formattedReward}원`;
  },

  orderedMenus(menus) {
    return `<주문 메뉴>\n${menus}\n`;
  },

  formatMoney(money) {
    return new Intl.NumberFormat('ko-KR').format(money);
  },

  totalPrice(totalPrice) {
    const formattedPrice = this.formatMoney(totalPrice);

    return `<할인 전 총주문 금액>\n${formattedPrice}원\n`;
  },

  serviceMenu(parsedMessage) {
    return `<증정 메뉴>\n${parsedMessage}\n`;
  },

  promotionList(parsedMessage) {
    return `<혜택 내역>\n${parsedMessage}\n`;
  },

  totalPromotion(totalPromotion) {
    const formattedPromotion = this.formatMoney(totalPromotion);
    const isZero = totalPromotion === 0;
    const promotionMessage = isZero ? 0 : `-${formattedPromotion}`;

    return `<총혜택 금액>\n${promotionMessage}원\n`;
  },

  discountedPrice(discountedPrice) {
    const formattedPrice = this.formatMoney(discountedPrice);

    return `<할인 후 예상 결제 금액>\n${formattedPrice}원\n`;
  },

  promotionBadge({ month, badge }) {
    return `<${month}월 이벤트 배지>\n${badge}`;
  },
};

export default MessageFormat;
