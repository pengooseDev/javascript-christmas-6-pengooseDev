const Calander = {
  getMonth() {
    const month = new Date().getMonth() + 1;

    return month;
  },

  getLastDay() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    return new Date(year, month, 0).getDate();
  },
};

export default Calander;
