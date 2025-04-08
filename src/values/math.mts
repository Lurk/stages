import { getOneNumber, Value } from "../value.mjs";
import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderSelectInputTo } from "../ui/common/select.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { spanWithText } from "../ui/common/span.mjs";
import { ComponentArgs, deserialize, limiter, serialize } from "../utils.mjs";

export type MathArgs = {
  name: string;
  mode_a?: string;
  lhs1?: string | number;
  rhs1?: string | number;
  mode_b?: string;
  lhs2?: string | number;
  rhs2?: string | number;
};

const options = [
  "sum",
  "sub",
  "mul",
  "pow",
  "div",
  "avg",
  "min",
  "max",
] as const;

function evaluate(
  o: string,
  lhs: Value,
  rhs: Value,
  now: number,
  i: number,
): number {
  switch (o) {
    case "sum":
      return getOneNumber(lhs(now, i)) + getOneNumber(rhs(now, i));
    case "sub":
      return getOneNumber(lhs(now, i)) - getOneNumber(rhs(now, i));
    case "mul":
      return getOneNumber(lhs(now, i)) * getOneNumber(rhs(now, i));
    case "pow":
      return Math.pow(getOneNumber(lhs(now, i)), getOneNumber(rhs(now, i)));
    case "div":
      return getOneNumber(lhs(now, i)) / getOneNumber(rhs(now, i));
    case "avg":
      return (getOneNumber(lhs(now, i)) + getOneNumber(rhs(now, i))) / 2;
    case "min":
      return Math.min(getOneNumber(lhs(now, i)), getOneNumber(rhs(now, i)));
    case "max":
      return Math.max(getOneNumber(lhs(now, i)), getOneNumber(rhs(now, i)));
    default:
      throw new Error(`option: ${o} is not supported`);
  }
}

export function math({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<MathArgs>) {
  const { container, showValue } = renderContainer({
    id: args.name,
    type: "math",
    onRemove: () => {
      state.values.unregister(`${args.name}_a`);
      state.values.unregister(`${args.name}_b`);
      onRemove();
      lhs1Remove();
      rhs1Remove();
      lhs2Remove();
      rhs2Remove();
    },
  });

  showValue("0");

  let componentState = { ...args };

  const {
    select: { el: mode_a },
  } = renderSelectInputTo({
    id: `${args.name}_mode_a`,
    label: "mode",
    selected: args.mode_a,
    options,
    container,
  });

  mode_a.addEventListener("change", () => {
    componentState = { ...componentState, mode_a: mode_a.value };
    onChange({ ...componentState });
  });

  const {
    value: lhs1,
    update: lhs1Update,
    onRemove: lhs1Remove,
    state: stateLhs1,
  } = connect({
    connectable: state.values,
    omit: `${args.name}_a`,
    container,
    id: `${args.name}_lhs1`,
    label: `lhs`,
    value: args.lhs1,
    onChange(lhs1) {
      componentState = { ...componentState, lhs1 };
      onChange({ ...componentState });
    },
  });

  const {
    value: rhs1,
    update: rhs1Update,
    onRemove: rhs1Remove,
    state: stateRhs1,
  } = connect({
    connectable: state.values,
    omit: `${args.name}_a`,
    container,
    id: `${args.name}_rhs1`,
    label: `rhs`,
    value: args.rhs1,
    onChange(rhs1) {
      componentState = { ...componentState, rhs1 };
      onChange({ ...componentState });
    },
  });

  const showValue2 = spanWithText(container, "0");

  const {
    select: { el: mode_b },
  } = renderSelectInputTo({
    id: `${args.name}_mode_b`,
    label: "mode",
    selected: args.mode_b,
    options,
    container,
  });

  mode_b.addEventListener("change", () => {
    componentState = { ...componentState, mode_b: mode_b.value };
    onChange({ ...componentState });
  });

  const {
    value: lhs2,
    update: lhs2Update,
    onRemove: lhs2Remove,
    state: stateLhs2,
  } = connect({
    connectable: state.values,
    omit: `${args.name}_b`,
    container,
    id: `${args.name}_lhs2`,
    label: `lhs`,
    value: args.lhs2,
    onChange(lhs2) {
      componentState = { ...componentState, lhs2 };
      onChange({ ...componentState });
    },
  });

  const {
    value: rhs2,
    update: rhs2Update,
    onRemove: rhs2Remove,
    state: stateRhs2,
  } = connect({
    connectable: state.values,
    omit: `${args.name}_b`,
    container,
    id: `${args.name}_in4`,
    label: `rhs`,
    value: args.rhs2,
    onChange(rhs2) {
      componentState = { ...componentState, rhs2 };
      onChange({ ...componentState });
    },
  });

  state.values.register(`${args.name}_a`, (now, i) => {
    const val = evaluate(mode_a.value, lhs1, rhs1, now, i);
    showValue(val.toPrecision(6));
    return [val];
  });

  const limitedVelueB = limiter(100, (val) => showValue2(val));

  state.values.register(`${args.name}_b`, (now, i) => {
    const val = evaluate(mode_b.value, lhs2, rhs2, now, i);
    limitedVelueB(val.toPrecision(6));
    return [val];
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    lhs1Update(args.lhs1);
    rhs1Update(args.rhs1);
    lhs2Update(args.lhs2);
    rhs2Update(args.rhs2);

    componentState = {
      name: componentState.name,
      mode_a: mode_a.value,
      lhs1: stateLhs1(),
      rhs1: stateRhs1(),
      mode_b: mode_b.value,
      lhs2: stateLhs2(),
      rhs2: stateRhs2(),
    };

    onChange(componentState);
  }, 1);
}

export const mathSerde: ComponentSerde<MathArgs> = () => {
  const keys = [
    "name",
    "mode_a",
    "lhs1",
    "rhs1",
    "mode_b",
    "lhs2",
    "rhs2",
  ] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(v, val, start) {
      let local_start = start;
      const res: MathArgs = {
        name: "",
        mode_a: "",
        lhs1: 0,
        rhs1: 0,
        mode_b: "",
        lhs2: 0,
        rhs2: 0,
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (
          typeof v === "string" &&
          (key === "name" || key === "mode_a" || key === "mode_b")
        ) {
          res[key] = v;
        } else if (
          key === "lhs1" ||
          key === "rhs1" ||
          key === "lhs2" ||
          key === "rhs2"
        ) {
          res[key] = v;
        } else {
          throw new Error(`Invalid value for ${key}: ${v}`);
        }
        local_start = end;
      });
      return { val: res, end: local_start };
    },
  };
};
