import { Outputs, outputs } from "./output.mjs";
import { Values, values } from "./value.mjs";

export type State = {
  values: Values;
  outputs: Outputs;
};

export function state(): State {
  const v = values();
  const o = outputs();
  return {
    values: v,
    outputs: o,
  };
}
