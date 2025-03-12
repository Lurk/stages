import { math, MathArgs } from "./controls/math.mjs";
import {
  OscillatorArgs,
  oscillatorWithConnectInput,
} from "./controls/oscillator.mjs";
import { random, RandomArgs } from "./controls/random.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./controls/slider.mjs";
import { AddOutputArgs, line, Output } from "./outputs.mjs";
import { assert } from "./utils.mjs";
import { Values } from "./value.mjs";
import { toString } from "./serde.mjs";

export type CreatorConfig =
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
      type: "line";
      args: AddOutputArgs;
    }
  | {
      type: "random";
      args: RandomArgs;
    };

export const CONTROL_TYPES: CreatorConfig["type"][] = [
  "slider",
  "oscillator",
  "math",
  "line",
  "random",
] as const;

export function controlTypeGuard(t: unknown): t is CreatorConfig["type"] {
  return CONTROL_TYPES.includes(t as CreatorConfig["type"]);
}

export type Updater = (control: CreatorConfig) => void;

export function controls(values: Values, outputs: Map<string, Output>) {
  const map = new Map<string, CreatorConfig>();

  const constructor = ({ type, args }: CreatorConfig): Updater => {
    const onRemove = () => map.delete(args.name);
    const onChange = (newConfig: CreatorConfig) => {
      const config = map.get(newConfig.args.name);
      assert(config, `Control with name ${args.name} does not exist`);
      map.set(config.args.name, newConfig);
      window.location.hash = toString([...map.values()]);
    };

    switch (type) {
      case "slider":
        return sliderWithNumericInputs({
          values,
          args,
          onRemove,
          onChange: (args: SliderArgs) => onChange({ type, args }),
        });
      case "oscillator":
        return oscillatorWithConnectInput({
          values,
          args,
          onRemove,
          onChange: (args) => onChange({ type, args }),
        });
      case "math":
        return math({
          values,
          args,
          onRemove,
          onChange: (args) => onChange({ type, args }),
        });
      case "line":
        return line({
          args,
          onRemove,
          values,
          outputs,
          onChange: (args) => onChange({ type, args }),
        });
      case "random":
        return random({
          values,
          args,
          onRemove,
          onChange: (args) => onChange({ type, args }),
        });
      default:
        throw new Error("Invalid control type");
    }
  };

  return {
    add(config: CreatorConfig) {
      if (!config.args.name) {
        alert("Please enter a name");
        throw new Error("Please enter a name");
      }

      if (map.has(config.args.name)) {
        alert(`Control with name ${config.args.name} already exists`);
        throw new Error(`Control with name ${config.args.name} already exists`);
      }
      map.set(config.args.name, config);
      return constructor(config);
    },
  };
}
