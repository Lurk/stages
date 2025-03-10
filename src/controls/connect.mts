import {
  assert,
  RenderSelectInputArgs,
  renderSelectInputTo,
} from "../utils.mjs";
import { Values, Value } from "../value.mjs";

export function connect(
  values: Values,
  omit: string,
  args: Omit<RenderSelectInputArgs, "options">,
): { value: Value; update: (val?: string) => void } {
  const element = renderSelectInputTo({ ...args, options: values.keys() });
  // TODO this is definitely leaks memory. When deleting the control with connected input this cb is not deleted.
  values.onChange((keys) => {
    element.updateOptions(keys.filter((k) => k !== omit));
  });

  assert(
    element.el instanceof HTMLSelectElement,
    `element with id='${args.id}' is not HTMLSelectElement`,
  );

  return {
    value: (now, i) => {
      return values.get(element.el.value)?.(now, i) ?? 0;
    },
    update: (val) => {
      if (val) {
        element.el.value = val;
      }
    },
  };
}
