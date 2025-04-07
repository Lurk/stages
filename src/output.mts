import { Box } from "./outputs/box.mjs";
import { Line } from "./outputs/line.mjs";

export type Output =
  | {
      kind: "line";
      value: Line;
    }
  | {
      kind: "box";
      value: Box;
    };

export type Outputs = Map<string, Output>;

export function outputs(): Outputs {
  return new Map();
}
