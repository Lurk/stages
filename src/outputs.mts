import { CapedLIFO, createCapedLIFO } from "./buffer.mjs";
import { Controls } from "./controls.mjs";
import { connect, Stage } from "./stages.mjs";
import { renderControl, renderSelectInputTo } from "./utils.mjs";

type Output = { selector: HTMLSelectElement; buffer: CapedLIFO; speed: Stage };

type Outputs = {
  outputs: Map<number, Output>;
  add: (name: string) => void;
};

export function initOutputs(
  ctrl: Controls,
  ctx: CanvasRenderingContext2D,
): Outputs {
  const outputs: Map<number, Output> = new Map();

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
        speed: connect(ctrl, "", {
          container,
          id: `${name}_speed_input`,
          label: "speed",
        }),
      });

      ctrl.onChange(updater);
    },
  };
}
