const Calander = {
  initialDay: 1,
  missionMonth: 12,

  // TODO: 혹시 모르니 반환하는 월 검증하기(1-12) 만들어둔 isInRange를 사용하면 될듯.
  getMonth() {
    // const month = new Date().getMonth() + 1;

    // 주어진 미션은 실제 달력에 기반하지 않고, 12월로 상정하였기에 아래와 같이 상수로 지정.
    return this.missionMonth;
  },

  getLastDay() {
    const year = new Date().getFullYear();
    const month = this.getMonth();

    return new Date(year, month, 0).getDate();
  },
};

export default Calander;
