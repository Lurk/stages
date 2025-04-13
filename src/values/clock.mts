import { renderContainer } from "../ui/common/container.mjs";
import { ComponentArgs } from "../utils.mjs";
import { connect } from "./connect.mjs";

export type ClockArgs = {
  rate?: string | number;
};

export function clock({
  state,
  args,
  onChange,
  onRemove,
}: ComponentArgs<ClockArgs>) {
  const container = renderContainer({
    id: "clock",
    type: "clock",
  });

  container.onRemove(() => {
    state.values.unregister("clock");
    onRemove();
  });

  let clockState: Readonly<ClockArgs> = {
    rate: 0,
  };

  const { value: rate, update: updateRate } = connect({
    connectable: state.values,
    omit: "clock",
    container,
    id: "rate",
    label: "rate",
    value: args.rate,
    onChange(rate) {
      clockState = { ...clockState, rate };
      onChange(clockState);
    },
  });
}
