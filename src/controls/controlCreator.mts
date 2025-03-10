import { OscillatorArgs, oscillatorWithConnectInput } from "./oscillator.mjs";
import { mixer, MixerArgs } from "./mixer.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./slider.mjs";
import { random, RandomArgs } from "./random.mjs";
import { AddOutputArgs, initOutputs, Output } from "../outputs.mjs";
import { Values, values } from "../value.mjs";
import { height, monotonic, one, width, zero } from "./defaults.mjs";
import { render } from "../ui/control.mjs";

export type CreatorArgs =
  | {
      type: "slider";
      args: SliderArgs;
    }
  | {
      type: "oscillator";
      args: OscillatorArgs;
    }
  | {
      type: "mixer";
      args: MixerArgs;
    }
  | {
      type: "output";
      args: AddOutputArgs;
    }
  | {
      type: "random";
      args: RandomArgs;
    };

export const CONTROL_TYPES: CreatorArgs["type"][] = [
  "slider",
  "oscillator",
  "mixer",
  "output",
  "random",
] as const;

export function controlTypeGuard(t: unknown): t is CreatorArgs["type"] {
  return CONTROL_TYPES.includes(t as CreatorArgs["type"]);
}

export type Updater = (control: CreatorArgs) => void;

export const creator = (
  values: Values,
  addOutput: (args: AddOutputArgs) => Updater,
  { type, args }: CreatorArgs,
): Updater => {
  if (!args.name) {
    alert("Please enter a name");
    throw new Error("Please enter a name");
  }

  switch (type) {
    case "slider":
      return sliderWithNumericInputs(values, args);
    case "oscillator":
      return oscillatorWithConnectInput(values, args);
    case "mixer":
      return mixer(values, args);
    case "output":
      return addOutput(args);
    case "random":
      return random(values, args);
    default:
      throw new Error("Invalid control type");
  }
};

export type InitControlsArgs = {
  ctx: CanvasRenderingContext2D;
  animate: () => void;
  controls: CreatorArgs[];
};

export function initControls({
  animate,
  controls,
  ctx,
}: InitControlsArgs): Map<number, Output> {
  const vals = values();
  const { outputs, add } = initOutputs(vals);

  render({ vals, add, animate });

  const u = controls.map((control) => ({
    updater: creator(vals, add, control),
    control,
  }));

  width(vals, ctx);
  height(vals, ctx);
  zero(vals);
  monotonic(vals);
  one(vals);

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    u.forEach(({ updater, control }) => updater(control));
  }, 10);

  return outputs;
}
