import { Controls, slider, wave, connect } from "../stages.mjs";
import { getOrCreateControl } from "../utils.mjs";

export function oscillatorWithNumericInputs(ctrl: Controls, id: string) {
  const lfoContainer = getOrCreateControl(id);
  const header = document.createElement("h3");
  header.innerText = id;
  lfoContainer.appendChild(header);
  const controls = document.createElement("div");
  controls.classList.add("controls");
  lfoContainer.appendChild(controls);
  
  ctrl.register(
    id,
    wave({
      min: slider({
        id: `${id}_min`,
        label: "min",
        value: 50,
        max: 500,
        container: controls,
      }),
      max: slider({
        id: `${id}_max`,
        label: "max",
        value: 50,
        max: 500,
        container: controls,
      }),
      raise: slider({
        id: `${id}_raise`,
        label: "raise",
        value: 50,
        max: 500,
        container: controls,
      }),
      fall: slider({
        id: `${id}_fall`,
        label: "fall",
        value: 50,
        max: 500,
        container: controls,
      }),
    }),
  );
}

export function oscillatorWithConnectInput(ctrl: Controls, id: string) {
  const wContainer = getOrCreateControl(id);
  const header = document.createElement("h3");
  header.innerText = id;
  wContainer.appendChild(header);
  
  ctrl.register(
    id,
    wave({
      min: connect(ctrl, {
        id: `${id}_min`,
        label: "min",
        container: wContainer,
      }),
      max: connect(ctrl, {
        id: `${id}_max`,
        label: "max",
        container: wContainer,
      }),
      raise: connect(ctrl, {
        id: `${id}_raise`,
        label: "raise",
        container: wContainer,
      }),
      fall: connect(ctrl, {
        id: `${id}_fall`,
        label: "fall",
        container: wContainer,
      }),
    }),
  );
} 