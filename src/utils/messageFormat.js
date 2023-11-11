const MessageFormat = {
  error(message) {
    return `[ERROR] ${message}`;
  },

  greetingByMonth(month) {
    return `안녕하세요! 우테코 식당 ${month}월 이벤트 플래너입니다.`;
  },
};

export default MessageFormat;
