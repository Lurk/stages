import { math, MathArgs } from "./controls/math.mjs";
import {
  OscillatorArgs,
  oscillatorWithConnectInput,
} from "./controls/oscillator.mjs";
import { random, RandomArgs } from "./controls/random.mjs";
import { SliderArgs, sliderWithNumericInputs } from "./controls/slider.mjs";
import { AddOutputArgs, line, Output } from "./controls/line.mjs";
import { assert } from "./utils.mjs";
import { Values } from "./value.mjs";
import { serde } from "./serde.mjs";

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

export function controls(values: Values, outputs: Map<string, Output>) {
  const map = new Map<string, CreatorConfig>();
  const sd = serde();
  const add = (config: CreatorConfig) => {
    if (!config.args.name) {
      alert("Please enter a name");
      throw new Error("Please enter a name");
    }

    if (map.has(config.args.name)) {
      alert(`Control with name ${config.args.name} already exists`);
      throw new Error(`Control with name ${config.args.name} already exists`);
    }

    map.set(config.args.name, config);
    const onRemove = () => map.delete(config.args.name);
    const onChange = (newConfig: CreatorConfig) => {
      assert(
        map.has(newConfig.args.name),
        `Control with name ${newConfig.args.name} does not exist`,
      );
      map.set(newConfig.args.name, newConfig);
      window.location.hash = sd.toString([...map.values()]);
    };

    switch (config.type) {
      case "slider":
        return sliderWithNumericInputs({
          values,
          args: config.args,
          onRemove,
          onChange: (args: SliderArgs) => onChange({ type: config.type, args }),
        });
      case "oscillator":
        return oscillatorWithConnectInput({
          values,
          args: config.args,
          onRemove,
          onChange: (args) => onChange({ type: config.type, args }),
        });
      case "math":
        return math({
          values,
          args: config.args,
          onRemove,
          onChange: (args) => onChange({ type: config.type, args }),
        });
      case "line":
        return line({
          values,
          outputs,
          args: config.args,
          onRemove,
          onChange: (args) => onChange({ type: config.type, args }),
        });
      case "random":
        return random({
          values,
          args: config.args,
          onRemove,
          onChange: (args) => onChange({ type: config.type, args }),
        });
      default:
        throw new Error("Invalid control type");
    }
  };

  sd.fromString(window.location.hash.slice(1)).forEach(add);

  return {
    add,
  };
}
