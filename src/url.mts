import { CreatorConfig } from "./factory.mjs";
import { serde } from "./serde.mjs";
import { assert, limiter } from "./utils.mjs";

export type URL = {
  toggleVisibility: () => void;
  areControlsVisible: () => boolean;
  addControl: (args: CreatorConfig) => void;
  updateControl: (args: Readonly<CreatorConfig>) => void;
  removeControl: (args: string) => void;
  eachControl: (cb: (args: CreatorConfig) => void) => void;
};

// TODO: should be debounced instead limited
const sync = limiter(300, (s: string) =>
  window.history.pushState({}, "", `./?s=${s}`),
);

export function url(): URL {
  window.addEventListener("popstate", () => {
    window.location.reload();
  });

  const sd = serde();
  const queryParams = new URLSearchParams(window.location.search);

  let { areControlsVisible, controls } = sd.fromString(
    queryParams.get("s") || "",
  );

  return {
    toggleVisibility() {
      areControlsVisible = !areControlsVisible;
      sync(sd.toString({ areControlsVisible, controls }));
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
      sync(sd.toString({ areControlsVisible, controls }));
    },
    updateControl(newConfig) {
      assert(
        controls.has(newConfig.args.name),
        `Control with name ${newConfig.args.name} does not exist`,
      );
      controls.set(newConfig.args.name, newConfig);
      sync(sd.toString({ areControlsVisible, controls }));
    },
    removeControl(name) {
      controls.delete(name);
      sync(sd.toString({ areControlsVisible, controls }));
    },
    eachControl(cb) {
      [...controls.values()].forEach(cb);
    },
  };
}
