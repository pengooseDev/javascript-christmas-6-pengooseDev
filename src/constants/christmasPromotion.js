const dateDiscount = Object.freeze({
  christmasDefault: 1_000,
  christmasDdayUnit: 100,
  weekday: 2_023,
  weekend: 2_023,
  special: 1_000,
});

const promotionName = Object.freeze({
  christmas: '크리스마스 디데이 할인',
  weekday: '평일 할인',
  weekend: '주말 할인',
  special: '특별 할인',
  badge: '할인 뱃지',
  serviceMenu: '증정 이벤트',
});

const billThreshold = Object.freeze({
  totalPrice: 120_000,
  santa: 20_000,
  tree: 10_000,
  star: 5_000,
});

const badge = Object.freeze({
  santa: '산타',
  tree: '트리',
  star: '별',
});

const serviceMenu = '샴페인';

const CHRISTMAS_PROMOTION = Object.freeze({
  dateDiscount,
  promotionName,
  billThreshold,
  badge,
  serviceMenu,
});

export default CHRISTMAS_PROMOTION;