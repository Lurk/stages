import { CapedLIFO, createCapedLIFO } from "./buffer.mjs";
import { Controls } from "./controls.mjs";
import { renderControl, renderSelectInputTo } from "./utils.mjs";

type Outputs = {
  outputs: Map<number, { selector: HTMLSelectElement; buffer: CapedLIFO }>;
  add: (name: string) => void;
};

export function initOutputs(
  ctrl: Controls,
  ctx: CanvasRenderingContext2D,
): Outputs {
  const outputs: Map<
    number,
    { selector: HTMLSelectElement; buffer: CapedLIFO }
  > = new Map();

  return {
    outputs,
    add(name) {
      const id = outputs.size;
      const updater = (keys: string[]) => updateOptions(keys);
      const { container } = renderControl(name, () => {
        ctrl.unsubscribe(updater);
        outputs.delete(id);
      });

      const { el, updateOptions } = renderSelectInputTo({
        container,
        options: ctrl.keys(),
        id: `${name}_y_input`,
        label: "y",
      });

      outputs.set(id, {
        selector: el,
        buffer: createCapedLIFO(Math.round(ctx.canvas.width)),
      });
      container.appendChild(el);

      ctrl.onChange(updater);
    },
  };
}
