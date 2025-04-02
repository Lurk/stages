import { AddOutputArgs, line, Output } from "./line.mjs";
import { Values, values } from "../value.mjs";
import { defaults } from "./defaults.mjs";
import { render } from "../ui/control.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./slider.mjs";
import { OscillatorArgs, oscillatorWithConnectInput } from "./oscillator.mjs";
import { math, MathArgs } from "./math.mjs";
import { random, RandomArgs } from "./random.mjs";
import { assert } from "../utils.mjs";
import { State, state } from "../state.mjs";
import { logic, LogicArgs } from "./logic.mjs";
import { recorder } from "../recorder.mjs";
import { Canvas } from "../canvas.mjs";
export type CreatorConfig =
  | { type: "slider"; args: SliderArgs }
  | { type: "oscillator"; args: OscillatorArgs }
  | { type: "math"; args: MathArgs }
  | { type: "line"; args: AddOutputArgs }
  | { type: "random"; args: RandomArgs }
  | { type: "logic"; args: LogicArgs };

export const CONTROL_TYPES: CreatorConfig["type"][] = [
  "slider",
  "oscillator",
  "math",
  "line",
  "random",
  "logic",
] as const;

export function controlTypeGuard(t: unknown): t is CreatorConfig["type"] {
  return CONTROL_TYPES.includes(t as CreatorConfig["type"]);
}

export type FactoryArgs = {
  canvas: Canvas;
};

type InitEventsArgs = {
  fullScreenTarget: HTMLElement;
  toggleVisibility: () => void;
};

function initEvents({ fullScreenTarget, toggleVisibility }: InitEventsArgs) {
  fullScreenTarget.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (e.target.requestFullscreen) {
        e.target.requestFullscreen();
      }
    }
  });

  document.onkeyup = function (e) {
    // space
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      toggleVisibility();
    }
  };
}

function init(
  state: State,
  values: Values,
  outputs: Map<string, Output>,
): (config: CreatorConfig, init?: boolean) => void {
  return (config, init) => {
    if (!init) {
      state.addControl(config);
    }

    const onRemove = () => state.removeControl(config.args.name);

    switch (config.type) {
      case "slider":
        return sliderWithNumericInputs({
          values,
          onRemove,
          args: config.args,
          onChange: (args: SliderArgs) =>
            state.updateControl({ type: config.type, args }),
        });
      case "oscillator":
        return oscillatorWithConnectInput({
          values,
          onRemove,
          args: config.args,
          onChange: (args) => state.updateControl({ type: config.type, args }),
        });
      case "math":
        return math({
          values,
          onRemove,
          args: config.args,
          onChange: (args) => state.updateControl({ type: config.type, args }),
        });
      case "line":
        return line({
          values,
          outputs,
          onRemove,
          args: config.args,
          onChange: (args) => state.updateControl({ type: config.type, args }),
        });
      case "random":
        return random({
          values,
          onRemove,
          args: config.args,
          onChange: (args) => state.updateControl({ type: config.type, args }),
        });
      case "logic":
        return logic({
          values,
          onRemove,
          args: config.args,
          onChange: (args) => state.updateControl({ type: config.type, args }),
        });
      default:
        throw new Error("Invalid control type");
    }
  };
}

export function factory({ canvas }: FactoryArgs): Map<string, Output> {
  const vals = values();
  const outputs: Map<string, Output> = new Map();
  const s = state();
  const add = init(s, vals, outputs);
  const controls = document.getElementById("controls");
  assert(controls, "#controls element was not wound");
  const record = recorder(canvas.ctx);

  if (!s.areControlsVisible()) {
    controls.classList.add("hidden");
    canvas.ctx.canvas.classList.add("fill");
  }

  render({
    vals,
    add,
    canvas,
    recorder: record,
  });

  initEvents({
    fullScreenTarget: canvas.ctx.canvas,
    toggleVisibility: () => {
      controls.classList.toggle("hidden");
      canvas.ctx.canvas.classList.toggle("fill");
      s.toggleVisibility();
    },
  });

  defaults(vals, canvas.ctx);

  s.eachControl((c) => add(c, true));

  return outputs;
}
