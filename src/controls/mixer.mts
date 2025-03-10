import { Values, Value } from "../value.mjs";
import { renderControl, renderSelectInputTo, spanWithText } from "../utils.mjs";
import { Updater } from "./controlCreator.mjs";
import { connect } from "./connect.mjs";

export type MathArgs = {
  name: string;
  mode1?: string;
  lhs1?: string;
  rhs1?: string;
  mode2?: string;
  lhs2?: string;
  rhs2?: string;
};

const options = ["sum", "avg", "neg", "mul"] as const;

function evaluate(
  o: string,
  lhs: Value,
  rhs: Value,
  now: number,
  i: number,
): number {
  switch (o) {
    case "sum":
      return lhs(now, i) + rhs(now, i);
    case "avg":
      return (lhs(now, i) + rhs(now, i)) / 2;
    case "neg":
      return lhs(now, i) - rhs(now, i);
    case "mul":
      return lhs(now, i) * rhs(now, i);
    default:
      throw new Error(`option: ${o} is not supported`);
  }
}

export function math(values: Values, args: MathArgs): Updater {
  const { container, showValue } = renderControl(args.name, () =>
    values.unregister(args.name),
  );

  const { el: mode_a } = renderSelectInputTo({
    id: `${args.name}_mode_a`,
    label: "mode",
    selected: args.mode1,
    options,
    container,
  });

  const { value: lhs1, update: lhs1_u } = connect(values, args.name, {
    id: `${args.name}_lhs1`,
    label: `lhs`,
    container,
    selected: args.lhs1,
  });

  const { value: rhs1, update: rhs1_u } = connect(values, args.name, {
    id: `${args.name}_rhs1`,
    label: `rhs`,
    container,
    selected: args.rhs2,
  });

  const showValue2 = spanWithText(container, "0");
  const { el: mode_b } = renderSelectInputTo({
    id: `${args.name}_mode_b`,
    label: "mode",
    selected: args.mode2,
    options,
    container,
  });

  const { value: lhs2, update: lhs2_u } = connect(values, args.name, {
    id: `${args.name}_lhs2`,
    label: `lhs`,
    container,
    selected: args.lhs2,
  });

  const { value: rhs2, update: rhs2_u } = connect(values, args.name, {
    id: `${args.name}_in4`,
    label: `rhs`,
    container,
    selected: args.rhs2,
  });

  values.register(`${args.name}_a`, (now, i) => {
    const val = evaluate(mode_a.value, lhs1, rhs1, now, i);
    showValue(val);
    return val;
  });

  values.register(`${args.name}_b`, (now, i) => {
    const val = evaluate(mode_b.value, lhs2, rhs2, now, i);
    showValue2(val.toPrecision(6));
    return val;
  });

  return (container) => {
    if (container.type !== "math") {
      throw new Error("Invalid container type");
    }

    if (container.args.name !== args.name) {
      throw new Error("Invalid container name");
    }

    lhs1_u(container.args.lhs1);
    rhs1_u(container.args.rhs2);
    lhs2_u(container.args.lhs2);
    rhs2_u(container.args.rhs2);
  };
}
