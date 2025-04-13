import { Container } from "../ui/common/container.mjs";
import { label } from "../ui/common/label.mjs";
import { numberInput } from "../ui/common/number_input.mjs";
import { select } from "../ui/common/select.mjs";
import { toggle } from "../ui/common/toggle.mjs";
import { assert } from "../utils.mjs";
import { Value } from "../value.mjs";

export type OnChangeCallback = (keys: string[]) => void;

export type Connectable = {
  keys: () => string[];
  get: (key: string) => Value | undefined;
  onChange: (cb: OnChangeCallback) => void;
  unsubscribe: (cb: OnChangeCallback) => void;
};

type Args = {
  id: string;
  connectable: Connectable;
  value?: string | number;
  omit: string;
  container: Container;
  label: string;
  hasNumberInput?: boolean;
  onChange: (key: string | number) => void;
};

type Connect = {
  value: Value;
  update: (val?: string | number) => void;
  state: () => string | number;
};

export function connect(args: Args): Connect {
  const connectContainer = document.createElement("div");
  connectContainer.classList.add("input");
  connectContainer.classList.add("withToggle");

  const isStatic = toggle({
    container: connectContainer,
    isActive: typeof args.value === "number",
    disabled: args.hasNumberInput === false,
    onChange: (isActive) => {
      if (isActive) {
        number.classList.remove("hidden");
        s.el.classList.add("hidden");
        args.onChange(number.valueAsNumber);
      } else {
        s.el.classList.remove("hidden");
        number.classList.add("hidden");
        args.onChange(s.el.value);
      }
    },
  });

  label({
    container: connectContainer,
    id: args.id,
    label: args.label,
  });

  const number = numberInput({
    id: args.id,
    container: connectContainer,
    value: typeof args.value === "number" ? args.value : 0,
  });

  number.addEventListener("change", () => {
    if (isStatic.isActive()) {
      args.onChange(number.valueAsNumber);
    }
  });

  const s = select({
    id: args.id,
    options: args.connectable.keys(),
    container: connectContainer,
    selected: typeof args.value === "string" ? args.value : undefined,
  });
  s.el.addEventListener("change", () => args.onChange(s.el.value));

  if (isStatic.isActive()) {
    number.classList.remove("hidden");
    s.el.classList.add("hidden");
  } else {
    s.el.classList.remove("hidden");
    number.classList.add("hidden");
  }

  const onChangeCb = (keys: string[]) => {
    s.updateOptions(keys.filter((k) => k !== args.omit));
  };

  args.connectable.onChange(onChangeCb);

  args.container.el.appendChild(connectContainer);
  args.container.onRemove(() => args.connectable.unsubscribe(onChangeCb));

  return {
    value: (now, i) => {
      return isStatic.isActive()
        ? [number.valueAsNumber]
        : (args.connectable.get(s.el.value)?.(now, i) ?? [0]);
    },
    update: (val) => {
      if (typeof val === "string") {
        s.el.value = val;
      } else if (typeof val === "number" || val === undefined) {
        number.value = val?.toString() ?? "0";
      } else {
        assert(false, `val is not string or number`);
      }
    },
    state: () => {
      return isStatic.isActive() ? number.valueAsNumber : s.el.value;
    },
  };
}
