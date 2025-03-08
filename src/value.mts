import { Controls } from "./controls.mjs";
import {
  assert,
  RenderNumberInputArgs,
  renderNumberInputTo,
  RenderSelectInputArgs,
  renderSelectInputTo,
} from "./utils.mjs";

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

export function connect(
  controls: Controls,
  omit: string,
  args: Omit<RenderSelectInputArgs, "options">,
): { value: Value; update: (val?: string) => void } {
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
    value: (now, i) => {
      return controls.get(element.el.value)?.(now, i) ?? 0;
    },
    update: (val) => {
      if (val) {
        element.el.value = val;
      }
    },
  };
}

export function inputNumber(args: RenderNumberInputArgs): Value {
  const element = renderNumberInputTo(args);
  return () => {
    return element.valueAsNumber;
  };
}
