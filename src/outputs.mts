import { CapedLIFO, createCapedLIFO } from "./buffer.mjs";
import { createControlCreator } from "./controls/controlCreator.mjs";
import { Controls } from "./stages.mjs";

export function initOutputs(
  width: number,
  ctrl: Controls,
): Map<number, { selector: HTMLSelectElement; buffer: CapedLIFO }> {
  const outputs: Map<
    number,
    { selector: HTMLSelectElement; buffer: CapedLIFO }
  > = new Map();

  const outputSelector = document.createElement("select");
  outputs.set(outputs.size, {
    selector: outputSelector,
    buffer: createCapedLIFO(Math.round(width)),
  });

  outputSelector.id = "output-selector";
  document.getElementById("control-creation")?.appendChild(outputSelector);

  const controlsContainer = document.getElementById("control-creation");
  if (controlsContainer) {
    createControlCreator(controlsContainer, ctrl, outputSelector);
  }

  return outputs;
}
