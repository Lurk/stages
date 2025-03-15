import { CreatorConfig } from "./controls/factory.mjs";
import { serde } from "./serde.mjs";
import { assert } from "./utils.mjs";

export type State = {
  toggleVisibility: () => void;
  areControlsVisible: () => boolean;
  addControl: (args: CreatorConfig) => void;
  updateControl: (args: CreatorConfig) => void;
  removeControl: (args: string) => void;
  eachControl: (cb: (args: CreatorConfig) => void) => void;
};

export function state(): State {
  const sd = serde();

  let { areControlsVisible, controls } = sd.fromString(
    window.location.hash.slice(1),
  );

  return {
    toggleVisibility() {
      areControlsVisible = !areControlsVisible;
      window.location.hash = sd.toString({ areControlsVisible, controls });
    },
    areControlsVisible() {
      return areControlsVisible;
    },
    addControl(config) {
      assert(config.args.name, "Please enter a name");
      assert(
        !controls.has(config.args.name),
        `Control with name ${config.args.name} already exists`,
      );

      controls.set(config.args.name, config);
      window.location.hash = sd.toString({ areControlsVisible, controls });
    },
    updateControl(newConfig) {
      assert(
        controls.has(newConfig.args.name),
        `Control with name ${newConfig.args.name} does not exist`,
      );
      controls.set(newConfig.args.name, newConfig);
      window.location.hash = sd.toString({ areControlsVisible, controls });
    },
    removeControl(name) {
      controls.delete(name);
      window.location.hash = sd.toString({ areControlsVisible, controls });
    },
    eachControl(cb) {
      [...controls.values()].forEach(cb);
    },
  };
}
