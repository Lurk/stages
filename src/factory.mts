import { AddLineArgs, line } from "./outputs/line.mjs";
import { defaults } from "./values/defaults.mjs";
import { render } from "./ui/factory/index.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./values/slider.mjs";
import {
  OscillatorArgs,
  oscillatorWithConnectInput,
} from "./values/oscillator.mjs";
import { math, MathArgs } from "./values/math.mjs";
import { random, RandomArgs } from "./values/random.mjs";
import { assert } from "./utils.mjs";
import { URL, url } from "./url.mjs";
import { logic, LogicArgs } from "./values/logic.mjs";
import { Canvas, initFullScreenCanvas } from "./canvas.mjs";
import { animation } from "./animation.mjs";
import { map, MapArgs } from "./values/map.mjs";
import { State, state } from "./state.mjs";
import { color, ColorArgs } from "./values/color.mjs";
import { BoxArgs, box } from "./outputs/box.mjs";
import { circle, CircleArgs } from "./outputs/circle.mjs";

export type CreatorConfig =
  | { type: "slider"; args: Readonly<SliderArgs> }
  | { type: "oscillator"; args: Readonly<OscillatorArgs> }
  | { type: "math"; args: Readonly<MathArgs> }
  | { type: "line"; args: Readonly<AddLineArgs> }
  | { type: "random"; args: Readonly<RandomArgs> }
  | { type: "logic"; args: Readonly<LogicArgs> }
  | { type: "map"; args: Readonly<MapArgs> }
  | { type: "color"; args: Readonly<ColorArgs> }
  | { type: "box"; args: Readonly<BoxArgs> }
  | { type: "circle"; args: Readonly<CircleArgs> };

export const CONTROL_TYPES: CreatorConfig["type"][] = [
  "slider",
  "oscillator",
  "math",
  "line",
  "random",
  "logic",
  "map",
  "color",
  "box",
  "circle",
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
  url: URL,
  state: State,
): (config: CreatorConfig, init?: boolean) => void {
  return (config, init) => {
    if (!init) {
      url.addControl(config);
    }

    const onRemove = () => url.removeControl(config.args.name);

    switch (config.type) {
      case "slider":
        return sliderWithNumericInputs({
          state,
          onRemove,
          args: config.args,
          onChange: (args: SliderArgs) =>
            url.updateControl({ type: config.type, args }),
        });
      case "oscillator":
        return oscillatorWithConnectInput({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "math":
        return math({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "line":
        return line({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "random":
        return random({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "logic":
        return logic({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "map":
        return map({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "color":
        return color({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "box":
        return box({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      case "circle":
        return circle({
          state,
          onRemove,
          args: config.args,
          onChange: (args) => url.updateControl({ type: config.type, args }),
        });
      default:
        throw new Error("Invalid control type");
    }
  };
}

export function factory() {
  const s = state();
  const u = url();
  const add = init(u, s);
  const controls = document.getElementById("controls");
  const factory = document.getElementById("factory");
  assert(controls, "#controls element was not wound");
  const canvas = initFullScreenCanvas({
    id: "canvas",
    backgroundCollor: "#2b2a2a",
  });
  const a = animation({
    canvas,
    outputs: s.outputs,
  });
  defaults(s.values, canvas.ctx);
  u.eachControl((c) => add(c, true));

  if (!u.areControlsVisible()) {
    controls.classList.add("hidden");
    factory?.classList.add("hidden");
    canvas.ctx.canvas.classList.add("fill");
  }

  render({
    animation: a,
    vals: s.values,
    add,
    canvas,
  });

  initEvents({
    fullScreenTarget: canvas.ctx.canvas,
    toggleVisibility: () => {
      controls.classList.toggle("hidden");
      factory?.classList.toggle("hidden");
      canvas.ctx.canvas.classList.toggle("fill");
      u.toggleVisibility();
    },
  });

  a.play();
}
