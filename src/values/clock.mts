import { ComponentSerde } from "../serde.mjs";
import { renderContainer } from "../ui/common/container.mjs";
import { spanWithText } from "../ui/common/span.mjs";
import { ComponentArgs, deserialize, serialize } from "../utils.mjs";
import { getOneNumber } from "../value.mjs";
import { connect } from "./connect.mjs";

export type ClockArgs = {
  name: string;
  rate?: string | number;
};

export function clock({
  state,
  args,
  onChange,
  onRemove,
}: ComponentArgs<ClockArgs>) {
  const container = renderContainer({
    id: "clock",
    type: "clock",
  });

  container.onRemove(() => {
    state.values.unregister("clock");
    onRemove();
  });

  let clockState: Readonly<ClockArgs> = { ...args };

  const rate = connect({
    connectable: state.values,
    omit: "clock",
    container,
    id: "rate",
    label: "rate",
    value: args.rate,
    onChange(rate) {
      clockState = { ...clockState, rate };
      onChange(clockState);
    },
  });

  const table = document.createElement("div");
  table.classList.add("clockTable");

  for (let i = 1; i <= 16; i++) {
    const row = document.createElement("div");
    spanWithText(row, `${i}:`);
    const val = spanWithText(row, "0");
    table.appendChild(row);

    state.values.register(`${args.name}_${i}`, (now, i) => {
      const rateValue = getOneNumber(rate(now, i));
      let value = 0;
      if (rateValue !== 0) {
        value = Math.floor(now / rateValue);
      }

      val(value.toString());
      return [value];
    });
  }
  container.el.appendChild(table);
}

export const clockSerde: ComponentSerde<ClockArgs> = () => {
  const keys = ["name", "rate"] as const;

  return {
    toString: (args) => keys.map((key) => serialize(args[key])).join(""),
    fromString(version, val, start) {
      let local_start = start;
      const res: ClockArgs = {
        name: "",
        rate: 0,
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
