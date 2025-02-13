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

  let keys = new Set(ctrl.keys());

  const addMore = () => {
    const el = document.createElement("select");
    const id = outputs.size;
    outputs.set(id, {
      selector: el,
      buffer: createCapedLIFO(Math.round(width)),
    });
    document.getElementById("outputs")?.appendChild(el);

    keys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.innerHTML = key;
      option.id = `output_${id}_${key}`;
      el.options.add(option);
    });
  };

  const add = document.createElement("button");
  add.onclick = addMore;
  add.innerHTML = "+";
  document.getElementById("outputs")?.appendChild(add);

  addMore();

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
