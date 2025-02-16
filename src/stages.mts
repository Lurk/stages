import { Controls } from "./controls.mjs";
import {
  assert,
  RenderNumberInputArgs,
  renderNumberInputTo,
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

export function connect(
  controls: Controls,
  omit: string,
  args: Omit<RenderSelectInputArgs, "options">,
): Stage {
  const element = renderSelectInputTo({ ...args, options: controls.keys() });
  // TODO this is definitely leaks memory. When deleting the control with connected input this cb is not deleted.
  controls.onChange((keys) => {
    element.updateOptions(keys.filter((k) => k !== omit));
  });

  assert(
    element.el instanceof HTMLSelectElement,
    `element with id='${args.id}' is not HTMLSelectElement`,
  );

  return {
    get(now) {
      return controls.get(element.el.value)?.get(now) ?? 0;
    },
    subscribe() {},
    cycle() {},
  };
}

export function inputNumber(args: RenderNumberInputArgs) {
  const element = document.getElementById(args.id) || renderNumberInputTo(args);
  assert(
    element instanceof HTMLInputElement,
    `element with id='${args.id}' is not HTMLInputElement`,
  );

  return {
    get() {
      return element.valueAsNumber;
    },
    subscribe() {},
    cycle() {},
  };
}
