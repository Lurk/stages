import { Value } from "./value.mjs";

export type OnRegisterCallback = (keys: string[]) => void;

export type Controls = {
  register(key: string, value: Value): void;
  unregister(key: string): void;
  get(key: string): Value | undefined;
  onChange(fn: OnRegisterCallback): void;
  unsubscribe(fn: OnRegisterCallback): void;
  keys(): string[];
};

export function controls(): Controls {
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
