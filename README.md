# FECONF 2022 상태관리 이 전쟁을 끝내러 왔다

## 전역 상태 관리

- 전역 상태 관리는 프론트엔드의 아키텍처 문제이다

<br/>

## Redux의 단점

### 1. Plain Object

- 상태 처리에 대해서도 순수 함수로 작성하기를 강제한다
- 자연스럽게 class가 쓰고싶어진다

<br/>

### 2. 거대 단일 스토어

- 대안으로 나오는 Micro Store ? recoil, zustand . .

<br/>

## useSyncExternalStore

- 스토어에 대한 업데이트를 강제로 동기화하여 외부 스토어가 concurrent read를 지원하는 새로운 hook

```javascript
import { useSyncExternalStore } from 'react';

// Basic usage. getSnapshot must return a cached/memoized result
useSyncExternalStore(
  subscribe: (callback) => Unsubscribe
  getSnapshot: () => State
) => State

// Selecting a specific field using an inline getSnapshot
const selectedField
	= useSyncExternalStore(
			store.subscribe,
			() => store.getSnapshot().selectedField);
```

<br/>

```javascript
// Store.ts
export default abstract class Store<Snapshot> {
  listeners = new Set<() => void>();

  snapshot = {} as Snapshot;

  addListener(listener: () => void) {
    this.listeners.add(listener);
  }

  removeListener(listener: () => void) {
    this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.snapshot;
  }

  publish() {
    this.listeners.forEach((listener) => listener());
  }
}
```

<br/>

```javascript
// CardStore.ts
import Store from './Store';

import Cart from '../models/Cart';
import Item from '../models/Item';

export type CartStoreSnapshot = {
  items: Item[];
}

export default class CartStore extends Store<CartStoreSnapshot> {
  cart = new Cart();

  constructor() {
    super();
    this.takeSnapshot();
  }

  addItem({ productId, quantity }: {
    productId: number;
    quantity: number;
  }) {
    this.cart = this.cart.addItem({ productId, quantity });

    this.update();
  }

  private update() {
    this.takeSnapshot();
    this.publish();
  }

  private takeSnapshot() {
    this.snapshot = {
      items: this.cart.items,
    };
  }
}
```

<br/>

```javascript
// useCartStore.ts
import { useSyncExternalStore } from 'react';

import CartStore, { CartStoreSnapshot } from '../stores/CartStore';

const cartStore = new CartStore();

export default function useCartStore(): [CartStoreSnapshot, CartStore] {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      cartStore.addListener(onStoreChange);
      return () => cartStore.removeListener(onStoreChange);
    },
    () => cartStore.getSnapshot(),
  );
  return [snapshot, cartStore];
}
```

---

_지난 FECONF TDD 영상에 이어 재밌게 잘 봤습니다^^_
