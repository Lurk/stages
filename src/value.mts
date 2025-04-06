import { Connectable, OnRegisterCallback } from "./values/connect.mjs";

export type Value = (now: number, i: number) => number[];

export type Values = {
  register(key: string, value: Value): void;
  unregister(key: string): void;
} & Connectable;

export function values(): Values {
  const map: Map<string, Value> = new Map();
  const onRegisterCallbacks: OnRegisterCallback[] = [];
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
