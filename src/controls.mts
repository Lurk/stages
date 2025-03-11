import { math, MathArgs } from "./controls/mixer.mjs";
import {
  OscillatorArgs,
  oscillatorWithConnectInput,
} from "./controls/oscillator.mjs";
import { random, RandomArgs } from "./controls/random.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./controls/slider.mjs";
import { AddOutputArgs } from "./outputs.mjs";
import { Values } from "./value.mjs";

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
      type: "math";
      args: MathArgs;
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
  "math",
  "output",
  "random",
] as const;

export function controlTypeGuard(t: unknown): t is CreatorArgs["type"] {
  return CONTROL_TYPES.includes(t as CreatorArgs["type"]);
}

export type Updater = (control: CreatorArgs) => void;

export function controls(
  values: Values,
  addOutput: (args: AddOutputArgs) => Updater,
) {
  const map = new Map<string, Updater>();

  const constructor = ({ type, args }: CreatorArgs): Updater => {
    if (!args.name) {
      alert("Please enter a name");
      throw new Error("Please enter a name");
    }

    if (map.has(args.name)) {
      alert("Name already exists");
      throw new Error("Name already exists");
    }

    switch (type) {
      case "slider":
        return sliderWithNumericInputs(values, args, () =>
          map.delete(args.name),
        );
      case "oscillator":
        return oscillatorWithConnectInput(values, args);
      case "math":
        return math(values, args);
      case "output":
        return addOutput(args);
      case "random":
        return random(values, args);
      default:
        throw new Error("Invalid control type");
    }
  };

  return {
    add(args: CreatorArgs) {
      const updater = constructor(args);
      map.set(args.args.name, updater);
      return updater;
    },
  };
}
