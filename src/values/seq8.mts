import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs, deserialize, limiter, serialize } from "../utils.mjs";
import { getOneNumber } from "../value.mjs";
import { connect } from "./connect.mjs";

export type Seq8Args = {
  name: string;
  clock?: string | number;
  1?: string | number;
  2?: string | number;
  3?: string | number;
  4?: string | number;
  5?: string | number;
  6?: string | number;
  7?: string | number;
  8?: string | number;
};

export function seq8({
  state,
  args,
  onRemove,
  onChange,
}: ComponentArgs<Seq8Args>) {
  const container = renderContainer({
    id: args.name,
    type: "seq8",
  });

  container.onRemove(() => {
    state.values.unregister(args.name);
    onRemove();
  });

  let componentState: Readonly<Seq8Args> = { ...args };

  const clock = connect({
    connectable: state.values,
    omit: args.name,
    container,
    id: `${args.name}_clock`,
    label: "clock",
    value: args.clock,
    onChange(clock) {
      componentState = { ...componentState, clock };
      onChange(componentState);
    },
  });

  const keys = [1, 2, 3, 4, 5, 6, 7, 8] as const;
  const values = keys.map((i) =>
    connect({
      connectable: state.values,
      omit: args.name,
      container,
      id: `${args.name}_${i}`,
      label: `${i}`,
      value: args[i],
      onChange(value) {
        componentState = { ...componentState, [i]: value };
        onChange(componentState);
      },
    }),
  );

  const showValue = limiter(100, (val) => container.showValue(val));

  state.values.register(args.name, (now, i) => {
    const clockValue = getOneNumber(clock(now, i));
    const index = clockValue % 8;
    const val = getOneNumber(values[index](now, i));

    showValue(val.toPrecision(6));
    return [val];
  });
}

export const seq8Serde: ComponentSerde<Seq8Args> = () => {
  const keys = ["name", "clock", 1, 2, 3, 4, 5, 6, 7, 8] as const;

  return {
    toString(args) {
      return keys.map((key) => serialize(args[key])).join("");
    },
    fromString(version, val, start) {
      let local_start = start;
      const res: Seq8Args = {
        name: "",
        clock: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
      };

      keys.forEach((key) => {
        const { val: v, end } = deserialize(val, local_start);
        if (typeof v === "string" && key === "name") {
          res[key] = v;
        } else if (key !== "name") {
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
