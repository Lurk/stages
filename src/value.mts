export type Value = (now: number, i: number) => number;

export function constant(value: number): Value {
  return () => value;
}

export type WaveOpts = {
  min: Value;
  max: Value;
  raise: Value;
  fall: Value;
};

export function wave(opts: WaveOpts): Value {
  return (now, i) => {
    const raise = opts.raise(now, i);
    const fall = opts.fall(now, i);
    const min = opts.min(now, i);
    const max = opts.max(now, i);

    const duration = fall + raise;

    const beginigOfCycle = Math.floor(now / duration) * duration;
    const since = now - beginigOfCycle;
    const distance = max - min;

    if (since < raise) {
      const speed = distance / raise;
      const distanceCovered = since * speed;
      return min + distanceCovered;
    } else {
      const speed = distance / fall;
      const distanceCovered = (since - raise) * speed;
      return max - distanceCovered;
    }
  };
}

export type OnRegisterCallback = (keys: string[]) => void;

export type Values = {
  register(key: string, value: Value): void;
  unregister(key: string): void;
  get(key: string): Value | undefined;
  onChange(fn: OnRegisterCallback): void;
  unsubscribe(fn: OnRegisterCallback): void;
  keys(): string[];
};

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
