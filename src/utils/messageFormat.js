const MessageFormat = {
  error(message) {
    return `[ERROR] ${message}`;
  },

  duplicatedMenu(name) {
    return `${name} 메뉴가 중복으로 등록되었습니다.`;
  },
};

export default MessageFormat;
