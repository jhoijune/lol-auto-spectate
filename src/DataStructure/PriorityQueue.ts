class Item<T> {
  constructor(private _key: number, private _value: T) {}

  get key(): number {
    return this._key;
  }

  get value(): T {
    return this._value;
  }

  set key(e: number) {
    this._key = e;
  }

  set value(e: T) {
    this._value = e;
  }
}

interface PriorityQueue<T> {
  size(): number;

  isEmpty(): boolean;

  add(k: number, v: T): this;

  peek(): [number, T];

  remove(): [number, T];
}

export default PriorityQueue;
export { Item };
