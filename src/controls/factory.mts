import { AddOutputArgs, line, Output } from "./line.mjs";
import { Values, values } from "../value.mjs";
import { height, monotonic, one, width, zero } from "./defaults.mjs";
import { render } from "../ui/control.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./slider.mjs";
import { OscillatorArgs, oscillatorWithConnectInput } from "./oscillator.mjs";
import { math, MathArgs } from "./math.mjs";
import { random, RandomArgs } from "./random.mjs";
import { assert } from "../utils.mjs";
import { State, state } from "../state.mjs";
import { logic, LogicArgs } from "./logic.mjs";
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
  ctx: CanvasRenderingContext2D;
  animate: () => void;
};

function initEvents(state: State) {
  const canvas = document.getElementById("canvas");
  const controls = document.getElementById("controls");
  assert(canvas, "#canvas element was not found");
  assert(controls, "#controls element was not wound");

  canvas.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (e.target.requestFullscreen) {
        e.target.requestFullscreen();
      }
    }
  });

  if (!state.areControlsVisible()) {
    controls.classList.add("hidden");
    canvas.classList.add("fill");
  }

  document.onkeyup = function (e) {
    // space
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      controls.classList.toggle("hidden");
      canvas.classList.toggle("fill");
      state.toggleVisibility();
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

export function factory({ animate, ctx }: FactoryArgs): Map<string, Output> {
  const vals = values();
  const outputs: Map<string, Output> = new Map();
  const s = state();
  const add = init(s, vals, outputs);

  initEvents(s);
  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  render({ vals, animate, add });

  s.eachControl((c) => add(c, true));

  return outputs;
}
