import { Line } from "./outputs/line.mjs";

export type Output = {
  kind: "line";
  value: Line;
};
export type Outputs = Map<string, Output>;

export function outputs(): Outputs {
  return new Map();
}
