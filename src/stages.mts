import {
  assert,
  RenderNumberInputArgs,
  renderNumberInputTo,
  RenderRangeArgs,
  renderRangeTo,
  RenderSelectInputArgs,
  renderSelectInputTo,
} from "./utils.mjs";

export type StageEvent = "start" | "end";

export type EventHandler = (e: StageEvent) => void;

export interface Stage {
  subscribe: (handler: EventHandler) => void;
  get: (now: number) => number;
  cycle: () => void;
}

export type StageOpts = {
  start: Stage;
  target: Stage;
  duration: Stage;
};

export function stage({ start, target, duration }: StageOpts): Stage {
  const subscribers: EventHandler[] = [];

  let since = 0;

  return {
    get(now) {
      const startValue = start.get(now);
      const targetValue = target.get(now);
      const durationValue = duration.get(now);

      if (since === 0) {
        since = now;
        subscribers.forEach((cb) => cb("start"));
        return startValue;
      }

      if (now - since > durationValue) {
        subscribers.forEach((cb) => cb("end"));
        return targetValue;
      }

      const distance =
        startValue < targetValue
          ? targetValue - startValue
          : startValue - targetValue;
      const speed = distance / durationValue;
      const distanceCovered = (now - since) * speed;

      return startValue >= targetValue
        ? startValue - distanceCovered
        : startValue + distanceCovered;
    },
    cycle() {
      since = 0;
    },
    subscribe(handler) {
      subscribers.push(handler);
    },
  };
}

export function sequence(stages: Stage[]): Stage {
  let currentStage = 0;
  let subscribers: EventHandler[] = [];
  stages.forEach((stage) => {
    stage.subscribe((e) => {
      if (e === "start" && currentStage === 0) {
        subscribers.forEach((cb) => cb("start"));
      } else if (e === "end" && currentStage === stages.length - 1) {
        subscribers.forEach((cb) => cb("end"));
      } else if (e === "end") {
        currentStage += 1;
      }
    });
  });
  return {
    get(now) {
      return stages[currentStage]?.get(now);
    },
    subscribe(cb) {
      subscribers.push(cb);
    },
    cycle() {
      stages.forEach((s) => s.cycle());
      currentStage = 0;
    },
  };
}

export function constant(value: number): Stage {
  return {
    get() {
      return value;
    },
    subscribe() {},
    cycle() {},
  };
}

export type WaveOpts = {
  min: Stage;
  max: Stage;
  raise: Stage;
  fall: Stage;
};

export function wave(opts: WaveOpts): Stage {
  const subscribers: EventHandler[] = [];
  const s = sequence([
    stage({ start: opts.min, target: opts.max, duration: opts.raise }),
    stage({ start: opts.max, target: opts.min, duration: opts.fall }),
  ]);

  s.subscribe((e) => {
    subscribers.forEach((cb) => cb(e));
    if (e === "end") {
      s.cycle();
    }
  });

  return {
    get(now) {
      return s.get(now);
    },
    subscribe(cb) {
      subscribers.push(cb);
    },
    cycle() {},
  };
}

export function slider(args: RenderRangeArgs): Stage {
  const element = document.getElementById(args.id) || renderRangeTo(args);
  assert(
    element instanceof HTMLInputElement,
    `element with id=${args.id} is not HTMLInputElement`,
  );
  return {
    get() {
      return element.valueAsNumber;
    },
    subscribe() {},
    cycle() {},
  };
}

export function connect(
  controls: Controls,
  omit: string,
  args: Omit<RenderSelectInputArgs, "options">,
): Stage {
  const element = renderSelectInputTo({ ...args, options: controls.keys() });
  controls.onRegister((keys) => {
    element.updateOptions(keys.filter((k) => k !== omit));
  });

  assert(
    element.el instanceof HTMLSelectElement,
    `element with id='${args.id}' is not HTMLSelectElement`,
  );

  return {
    get(now) {
      const val = controls.get(element.el.value)?.get(now) ?? 0;
      element.updateValue(val.toFixed(3));
      return val;
    },
    subscribe() {},
    cycle() {},
  };
}

export function inputNumber(args: RenderNumberInputArgs) {
  const element =
    document.getElementById(args.label) || renderNumberInputTo(args);
  assert(
    element instanceof HTMLInputElement,
    `element with id='${args.label}' is not HTMLInputElement`,
  );

  return {
    get() {
      return element.valueAsNumber;
    },
    subscribe() {},
    cycle() {},
  };
}

type OnRegisterCallback = (keys: string[]) => void;

export type Controls = {
  register(key: string, stage: Stage): void;
  get(key: string): Stage | undefined;
  onRegister(fn: OnRegisterCallback): void;
  keys(): string[];
};

export function controls(): Controls {
  const map: Map<string, Stage> = new Map();
  const onRegisterCallbacks: OnRegisterCallback[] = [];
  return {
    register(key, stage) {
      map.set(key, stage);
      const keys = this.keys();
      onRegisterCallbacks.forEach((fn) => fn(keys));
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

export function renderMixer(
  ctrl: Controls,
  options: {
    id: string;
    label?: string;
    container?: HTMLElement;
  },
): Stage {
  const container = document.createElement("div");

  const input1 = connect(ctrl, options.id, {
    id: `${options.id}_in1`,
    label: `1`,
    container,
  });

  const input2 = connect(ctrl, options.id, {
    id: `${options.id}_in2`,
    label: `2`,
    container,
  });

  const input3 = connect(ctrl, options.id, {
    id: `${options.id}_in3`,
    label: `3`,
    container,
  });

  const input4 = connect(ctrl, options.id, {
    id: `${options.id}_in4`,
    label: `4`,
    container,
  });

  const input5 = connect(ctrl, options.id, {
    id: `${options.id}_in5`,
    label: `5`,
    container,
  });

  if (options.container) {
    options.container.appendChild(container);
  }

  const { el: mode } = renderSelectInputTo({
    id: `${options.id}_mode`,
    label: "mode",
    options: ["sum", "avg"],
    container,
  });

  const sum = (now: number) =>
    (input1.get(now) || 0) +
    (input2.get(now) || 0) +
    (input3.get(now) || 0) +
    (input4.get(now) || 0) +
    (input5.get(now) || 0);

  return {
    get(now: number) {
      const m = mode.value;
      if (m === "avg") {
        return sum(now) / 5;
      }
      return sum(now);
    },
    subscribe() {},
    cycle() {},
  };
}
