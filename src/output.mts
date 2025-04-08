import { Box } from "./outputs/box.mjs";
import { Circle } from "./outputs/circle.mjs";
import { Line } from "./outputs/line.mjs";

export type Output =
  | {
      kind: "line";
      value: Line;
    }
  | {
      kind: "box";
      value: Box;
    }
  | {
      kind: "circle";
      value: Circle;
    };

export type Outputs = Map<string, Output>;

export function outputs(): Outputs {
  return new Map();
}
