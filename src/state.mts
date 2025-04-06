import { Outputs, outputs } from "./output.mjs";
import { Values, values } from "./value.mjs";

export type State = {
  values: Values;
  outputs: Outputs;
  colors: Values;
};

export function state(): State {
  return {
    values: values(),
    outputs: outputs(),
    colors: values(),
  };
}
