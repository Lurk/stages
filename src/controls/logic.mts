import { Values, Value } from "../value.mjs";
import { connect } from "./connect.mjs";
import { ComponentSerde } from "../serde.mjs";
import { renderSelectInputTo } from "../ui/common/select.mjs";
import { renderContainer } from "../ui/common/container.mjs";

export type LogicArgs = {
  name: string;
  mode?: string;
  lhs?: string;
  rhs?: string;
  is_true?: string;
  is_false?: string;
};

const options = ["gt", "gte", "lt", "lte", "eq", "neq"] as const;

function evaluate(
  o: string,
  lhs: Value,
  rhs: Value,
  is_tue: Value,
  is_false: Value,
  now: number,
  i: number,
): number {
  switch (o) {
    case "gt":
      return lhs(now, i) > rhs(now, i) ? is_tue(now, i) : is_false(now, i);
    case "gte":
      return lhs(now, i) >= rhs(now, i) ? is_tue(now, i) : is_false(now, i);
    case "lt":
      return lhs(now, i) < rhs(now, i) ? is_tue(now, i) : is_false(now, i);
    case "lte":
      return lhs(now, i) <= rhs(now, i) ? is_tue(now, i) : is_false(now, i);
    case "eq":
      return lhs(now, i) == rhs(now, i) ? is_tue(now, i) : is_false(now, i);
    case "neq":
      return lhs(now, i) != rhs(now, i) ? is_tue(now, i) : is_false(now, i);
    default:
      throw new Error(`option: ${o} is not supported`);
  }
}

type Args = {
  values: Values;
  args: LogicArgs;
  onRemove: () => void;
  onChange: (args: LogicArgs) => void;
};

export function logic({ values, args, onRemove, onChange }: Args) {
  const { container, showValue } = renderContainer(args.name, false, () => {
    values.unregister(args.name);
    onRemove();
    lhs_r();
    rhs_r();
    is_false_r();
    is_true_r();
  });

  const state = { ...args };

  const {
    value: lhs,
    update: lhs_u,
    onRemove: lhs_r,
    selected: selectedLhs,
  } = connect({
    values,
    omit: `${args.name}_a`,
    args: {
      id: `${args.name}_lhs`,
      label: `lhs`,
      container,
      selected: args.lhs,
    },
    onChange(lhs) {
      onChange({ ...Object.assign(state, { lhs }) });
    },
  });

  const { el: mode } = renderSelectInputTo({
    id: `${args.name}_mode`,
    label: "mode",
    selected: args.mode,
    options,
    container,
  });

  mode.addEventListener("change", () => {
    onChange({ ...Object.assign(state, { mode: mode.value }) });
  });

  const {
    value: rhs,
    update: rhs_u,
    onRemove: rhs_r,
    selected: selectedRhs,
  } = connect({
    values,
    omit: `${args.name}`,
    args: {
      id: `${args.name}_rhs`,
      label: `rhs`,
      container,
      selected: args.rhs,
    },
    onChange(rhs) {
      onChange({ ...Object.assign(state, { rhs }) });
    },
  });

  const {
    value: is_true,
    update: is_true_u,
    onRemove: is_true_r,
    selected: selectedIsTrue,
  } = connect({
    values,
    omit: `${args.name}`,
    args: {
      id: `${args.name}_is_true`,
      label: `is_true`,
      container,
      selected: args.is_true,
    },
    onChange(is_true) {
      onChange({ ...Object.assign(state, { is_true }) });
    },
  });

  const {
    value: is_false,
    update: is_false_u,
    onRemove: is_false_r,
    selected: selectedIsFalse,
  } = connect({
    values,
    omit: `${args.name}`,
    args: {
      id: `${args.name}_is_false`,
      label: `is_false`,
      container,
      selected: args.is_false,
    },
    onChange(is_false) {
      onChange({ ...Object.assign(state, { is_false }) });
    },
  });

  values.register(`${args.name}`, (now, i) => {
    const val = evaluate(mode.value, lhs, rhs, is_true, is_false, now, i);
    showValue(val.toPrecision(6));
    return val;
  });

  // TODO: come up with a better way to do this.
  // Because controls can be in random order, first, we need to create them all, and only then connect.
  // Somehow, without this timeout update doesn't work (at least in Safari).
  setTimeout(() => {
    lhs_u(args.lhs);
    rhs_u(args.rhs);
    is_true_u(args.is_true);
    is_false_u(args.is_false);

    Object.assign(state, {
      lhs: selectedLhs(),
      rhs: selectedRhs(),
      is_true: selectedIsTrue(),
      is_false: selectedIsFalse(),
    });
    onChange(state);
  }, 1);
}

export const logicSerde: ComponentSerde<LogicArgs> = (
  serialize,
  deserialize,
) => {
  const keys = ["name", "mode", "lhs", "rhs", "is_true", "is_false"] as const;
  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },

    fromString(val, start) {
      let local_start = start;
      const res: LogicArgs = {
        name: "",
        mode: "",
        lhs: "",
        rhs: "",
        is_true: "",
        is_false: "",
      };
      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        local_start = end;
        res[key] = v;
      });
      return { val: res, end: local_start };
    },
  };
};
