import { label } from "../ui/common/label.mjs";
import { numberInput } from "../ui/common/number_input.mjs";
import { RenderSelectInputArgs, select } from "../ui/common/select.mjs";
import { toggle } from "../ui/common/toggle.mjs";
import { assert } from "../utils.mjs";
import { Values, Value } from "../value.mjs";

type Args = {
  values: Values;
  omit: string;
  container: HTMLDivElement;
  args: Omit<RenderSelectInputArgs, "options" | "container">;
  onChange: (key: string) => void;
};

type Connect = {
  value: Value;
  update: (val?: string) => void;
  onRemove: () => void;
  selected: () => string;
};

export function connect({
  values,
  omit,
  args,
  onChange,
  container,
}: Args): Connect {
  const connectContainer = document.createElement("div");
  connectContainer.classList.add("input");
  connectContainer.classList.add("withToggle");
  const isStatic = toggle({
    container: connectContainer,
    onChange: (isActive) => {
      if (isActive) {
        number.classList.remove("hidden");
        s.el.classList.add("hidden");
      } else {
        s.el.classList.remove("hidden");
        number.classList.add("hidden");
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
    value: 0,
  });
  const s = select({
    ...args,
    options: values.keys(),
    container: connectContainer,
  });

  if (isStatic.isActive()) {
    number.classList.remove("hidden");
    s.el.classList.add("hidden");
  } else {
    s.el.classList.remove("hidden");
    number.classList.add("hidden");
  }

  const onChangeCb = (keys: string[]) => {
    s.updateOptions(keys.filter((k) => k !== omit));
    values.onChange(onChangeCb);
    assert(
      s.el instanceof HTMLSelectElement,
      `element with id='${args.id}' is not HTMLSelectElement`,
    );

    s.el.addEventListener("change", () => onChange(s.el.value));
  };

  container.appendChild(connectContainer);

  return {
    value: (now, i) => {
      return isStatic.isActive()
        ? number.valueAsNumber
        : (values.get(s.el.value)?.(now, i) ?? 0);
    },
    update: (val) => {
      if (val) {
        s.el.value = val;
      }
    },
    onRemove() {
      values.unsubscribe(onChangeCb);
    },
    selected() {
      return s.el.value;
    },
  };
}
