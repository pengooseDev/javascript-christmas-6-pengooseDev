const MessageFormat = {
  error(message) {
    return `[ERROR] ${message}`;
  },

  duplicatedMenu(name) {
    return this.error(`중복된 메뉴가 존재합니다. (${name})`);
  },
};

export default MessageFormat;
