const MessageFormat = {
  error(message) {
    return `[ERROR] ${message}`;
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
};

export default MessageFormat;
