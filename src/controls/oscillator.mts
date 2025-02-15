
export function oscillatorWithConnectInput(ctrl: Controls, id: string) {
  const wContainer = getOrCreateControl(id);

  ctrl.register(
    id,
    wave({
      min: connect(ctrl, id, {
        id: `${id}_min`,
        label: "min",
        container: wContainer,
      }),
      max: connect(ctrl, id, {
        id: `${id}_max`,
        label: "max",
        container: wContainer,
      }),
      raise: connect(ctrl, id, {
        id: `${id}_raise`,
        label: "raise",
        container: wContainer,
      }),
      fall: connect(ctrl, id, {
        id: `${id}_fall`,
        label: "fall",
        container: wContainer,
      }),
    }),
  );
}
