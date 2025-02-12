import { CapedLIFO, createCapedLIFO } from "./buffer.mjs";
import { Controls } from "./stages.mjs";

export function initOutputs(
  width: number,
  ctrl: Controls,
): Map<number, { selector: HTMLSelectElement; buffer: CapedLIFO }> {
  const outputs: Map<
    number,
    { selector: HTMLSelectElement; buffer: CapedLIFO }
  > = new Map();

  const el = document.createElement("select");
  outputs.set(outputs.size, {
    selector: el,
    buffer: createCapedLIFO(Math.round(width)),
  });

  document.getElementById("control-creation")?.appendChild(el);
  let keys = new Set(ctrl.keys());

  ctrl.onRegister((newKeys) => {
    const newSet = new Set(newKeys);
    const diff = newSet.symmetricDifference(keys);
    diff.forEach((key) => {
      if (keys.has(key)) {
        document.getElementById(`output_${key}`)?.remove();
      } else {
        const option = document.createElement("option");
        option.value = key;
        option.innerHTML = key;
        option.id = `output_${key}`;
        el.options.add(option);
      }
    });
    keys = newSet;
  });

  return outputs;
}
