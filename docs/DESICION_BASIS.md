# 앗? 이 문서는?

안보셔도 됩니다.

코드를 작성하며 제가 했던 고민들이나 생각들. 그리고 의사결정 근거들을 의식의 흐름대로 적어둔 파일입니다 :)

아무래도 규모가 조금 커서 메모장에 적는거보단, 이렇게 남기면 좋을 것 같아서 파일로 분리하였으며, 해당 내용들은 기능명세서에 그대로 반영됩니다! :)

---

일단 도메인 분리하기! 아직도 도메인이 어렵지만 그래도 읽은 글들을 바탕으로 다시 잘 분류해보기!

# 1. 우테코 식당

협력 관계 : 메뉴(일단 달력이라던가 뭐 많지만 가볍게 메뉴부터 정복!)

---

# 2. 메뉴

## 메뉴 서비스(MenuService) - 도메인로직!

```js
class MenuService {
  #menu = new Map(); // 메뉴판. 해시맵으로 관리하자.

  constructor(menus) {
    // 메뉴들을 주입받아 메뉴판을 생성한다.
    this.#menu = this.#createMenu(menus);
  }

  #createMenu(menus) {
    // 여기서 Menu 객체로 관리하기!
  }
}
```

- [ ] 🚨 동일한 메뉴가 들어올 경우, 예외처리 한다.

```
흠, Set써서 넘길까 하다가단, 명확히 에러를 고지해주는게 좋겠다. 동일한 메뉴인데 가격이 다르면 의도치 않은 에러가 발생할 수 있으니까! 에러 던지는거 너무 두려워말자. 적절한 에러는 오히려 도움이 된다.
```

## Menu

> 결론 : 기각! 오버엔지니어링으로 판별! => MenuService에서 해시맵으로 구현하기로함

흠 메뉴는 어떤 정보를 가지고있어야할까?
일단 `필드`는 `이름`과 `가격`!

가격을 열어두기보다 `이름을 매개변수로 전달` 받고 그에 대한 `가격`을 return하는 식으로 구현하자! 그럼 캡슐화 됨!

```js
class Menu {
  #name;

  #price;

  constructor({ name, price }) {
    this.#name = name;
    this.#price = price;
  }

  checkPriceByName(name) {
    if (this.#name === name) return this.#price;
  }
}
```

음,.. 근데 이게 효율적인가? 해시맵으로 관리하면 바로바로 찾을 수 있는데 이건 모든 메뉴에 대해 메서드를 실행해야하는데..

MenuService에서 그냥 해시맵을 private 필드로 숨겨두고 getPriceByName메서드를 열어주면 되겠네!
Menu 구현은 흥미롭지만, 지금에선 오버엔지니어링인 것 같음!
패스패스-

---

대신 이렇게 구현하자!

```js
// 주입받는 menus

const menus = [
  {
    name: '메뉴 이름1',
    price: 30_000,
  },
  {
    name: '메뉴 이름2',
    price: 30_000,
  },
  // ...메뉴들
];
```

```js
class MenuService {
  #menu = new Map(); // 메뉴판. 해시맵으로 관리하자.

  constructor(menus) {
    // 메뉴들을 주입받아 메뉴판을 생성한다.
    this.#menu = this.#createMenu(menus);
  }

  #createMenu(menus) {
    // 여기서 Menu 객체로 관리하기!
  }
}
```

음 아니다. 서비스가 해시맵을 들고있는게 맞나..?

Menu를 변형해서 메뉴 하나가 아니라 메뉴판(MenuBoard)으로 만들고, 이 모델을 MenuService가 들고있도록 해야겠다! 아직 도메인이 어색해서 쉽지 않다.

```js
class MenuService {
  #menuBoard;

  constructor(menus) {
    // 메뉴들을 주입받아 메뉴판을 생성한다.
    this.#menuBoard = new MenuBoard(menus);
  }

  order(orders) {}
}
```

```js
class MenuBoard {
  #menus = new Map();

  constructor(menus) {
    menus.forEach((menu) => {
      const { name, price } = menu;

      this.#menus.set(name, price);
    });
  }
}
```

---

## 고민 : menu 가독성. 구조분해 위치?

1안

```js
class MenuBoard {
  #menus = new Map();

  constructor(menus) {
    menus.forEach((menu) => {
      const { name, price } = menu;

      this.#menus.set(name, price);
    });
  }
}
```

2안

```js
class MenuBoard {
  #menus = new Map();

  constructor(menus) {
    menus.forEach(({ name, price }) => this.#menus.set(name, price));
  }
}
```

흠 2안이 메뉴라는걸 명시적으로 못보여주긴 하는데, 오히려 1안은 코드가 길어져서 가독성이 떨어지는 것 같다.
보다보면 후자가 나은 것 같긴 하네. 후자 채택!

아 맞다 중복 예외처리

```js
class MenuBoard {
  #menus = new Map();

  constructor(menus) {
    menus.forEach(({ name, price }) => {
      this.#menus.set(name, price);
    });
  }

  #validateMenus(menus) {}
}
```

## 고민 : 중복 검증 방식

`1. 메뉴들을 가지고 중복 검증한 뒤에, Map에 등록할까` 2. 아니면 Map에 등록하면서 Map에 존재 여부를 확인할까..?

의존성이 없는건 전자긴 함.
menus가 new Map이 아니라 다른 자료구조를 쓴다면? validation 함수에 의존성생김.
분리하자. `1안` 고고!

```js
class MenuBoard {
  #menus = new Map();

  constructor(menus) {
    menus.forEach(({ name, price }) => {
      this.#menus.set(name, price);
    });
  }

  #validateMenus(menus) {
    menus;
  }

  #checkDuplicatedMenu(menus) {}
}
```
