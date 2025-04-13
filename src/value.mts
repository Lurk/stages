import { assert } from "./utils.mjs";
import { Connectable, OnChangeCallback } from "./values/connect.mjs";

export type Value = (now: number, i: number) => number[];

export type Values = {
  register(key: string, value: Value): void;
  unregister(key: string): void;
} & Connectable;

export function values(): Values {
  const map: Map<string, Value> = new Map();
  const onRegisterCallbacks: OnChangeCallback[] = [];
  return {
    register(key, value) {
      if (map.has(key)) {
        alert("duplicate id");
      } else {
        map.set(key, value);
        const keys = this.keys();
        onRegisterCallbacks.forEach((fn) => fn(keys));
      }
    },
    unregister(key) {
      if (map.has(key)) {
        map.delete(key);
        const keys = this.keys();
        onRegisterCallbacks.forEach((fn) => fn(keys));
      }
    },
    get(key) {
      return map.get(key);
    },
    keys() {
      return [...map.keys()];
    },
    onChange(fn) {
      onRegisterCallbacks.push(fn);
    },
    unsubscribe(fn) {
      const index = onRegisterCallbacks.indexOf(fn);
      if (index > -1) {
        onRegisterCallbacks.splice(index, 1);
      }
    },
  };
}

export function getOneNumber(number: number[]): number {
  assert(
    number.length === 1,
    `Expected array of length 1 but got ${number.length}`,
  );
  return number[0];
}

export function getFourNumbers(
  number: number[],
): [number, number, number, number] {
  assert(
    number.length === 4,
    `Expected array of length 4 but got ${number.length}`,
  );
  return number as [number, number, number, number];
}
