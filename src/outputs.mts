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

  const addMore = () => {
    const el = document.createElement("select");
    outputs.set(outputs.size, {
      selector: el,
      buffer: createCapedLIFO(Math.round(width)),
    });
    document.getElementById("outputs")?.appendChild(el);
  };

  const add = document.createElement("button");
  add.onclick = addMore;
  add.innerHTML = "+";
  document.getElementById("outputs")?.appendChild(add);

  addMore();

  let keys = new Set(ctrl.keys());

  ctrl.onRegister((newKeys) => {
    const newSet = new Set(newKeys);
    const diff = newSet.symmetricDifference(keys);

    outputs.entries().forEach(([id, val]) => {
      diff.forEach((key) => {
        if (keys.has(key)) {
          document.getElementById(`output_${id}_${key}`)?.remove();
        } else {
          const option = document.createElement("option");
          option.value = key;
          option.innerHTML = key;
          option.id = `output_${id}_${key}`;
          val.selector.options.add(option);
        }
      });
    });
    keys = newSet;
  });

  return outputs;
}
