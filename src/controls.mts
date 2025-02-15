import { Stage } from "./stages.mjs";

export type OnRegisterCallback = (keys: string[]) => void;

export type Controls = {
  register(key: string, stage: () => Stage): void;
  get(key: string): Stage | undefined;
  onRegister(fn: OnRegisterCallback): void;
  keys(): string[];
};

export function controls(): Controls {
  const map: Map<string, Stage> = new Map();
  const onRegisterCallbacks: OnRegisterCallback[] = [];
  return {
    register(key, stage) {
      if (map.has(key)) {
        alert("duplicate id");
      } else {
        map.set(key, stage());
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
    onRegister(fn) {
      onRegisterCallbacks.push(fn);
    },
  };
}
