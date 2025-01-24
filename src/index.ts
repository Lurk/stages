import { subscribe } from "diagnostics_channel";

interface Value {
  get: (now: number) => number;
  reset: () => void;
}

function constant(value: number): Value {
  return {
    get() {
      return value;
    },
    reset() {},
  };
}

type EventHandler = (e: "start" | "end") => void;

interface Stage extends Value {
  subscribe: (handler: EventHandler) => void;
}

type StageOpts = {
  start: Stage;
  target: Stage;
  duration: Stage;
};

function stage({ start, target, duration }: StageOpts): Stage {
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
    reset() {
      start.reset();
      target.reset();
      duration.reset();
      since = 0;
    },
    subscribe(handler) {
      subscribers.push(handler);
    },
  };
}

function sequence(stages: Stage[]): Stage {
  let currentStage = 0;
  let subscribers: EventHandler[] = [];
  stages.forEach((stage) => {
    stage.subscribe((e) => {
      if (e === "start" && currentStage === 0) {
        subscribscers
      }
      if (e === "end") {
        currentStage += 1;
      }
    });
  });
  return {
    get(now) {
      return stages[currentStage]?.get(now);
    },
    reset() {
      stages.forEach((s) => s.reset());
      currentStage = 0;
    },
    subscribe(cb) {
      subscribers.push(cb);
    },
  };
}
