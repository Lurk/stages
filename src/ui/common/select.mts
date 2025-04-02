export type RenderSelectInputArgs = {
  options: readonly string[];
  selected?: string;
  id: string;
  label?: string;
  disabled?: boolean;
  container: HTMLDivElement;
};

export function renderSelectInputTo(args: RenderSelectInputArgs): {
  el: HTMLSelectElement;
  updateOptions: (options: string[]) => void;
} {
  const container = document.createElement("div");
  container.classList.add("input");

  const el = document.createElement("select");
  el.id = args.id + "_#_select_#_";

  el.disabled = args.disabled ?? false;

  args.options.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    option.id = `${args.id}_${key}`;
    option.selected = key === args.selected;
    el.options.add(option);
  });

  const label = document.createElement("label");
  label.htmlFor = el.id;
  label.innerHTML = args.label ?? args.id;

  container.appendChild(label);
  container.appendChild(el);

  args.container.appendChild(container);

  let keys = new Set(args.options);

  return {
    el,
    updateOptions: (options) => {
      const newKeys = new Set(options);
      const diff = newKeys.symmetricDifference(keys);
      diff.forEach((key) => {
        if (keys.has(key)) {
          document.getElementById(`${args.id}_${key}`)?.remove();
        } else {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = key;
          option.id = `${args.id}_${key}`;
          el.options.add(option);
        }
      });
      keys = newKeys;
    },
  };
}
