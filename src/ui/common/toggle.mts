type ToggleArgs = {
  container: HTMLElement;
  isActive?: boolean;
  onChange: (isActive: boolean) => void;
};

export type Toggle = {
  isActive: () => boolean;
  toggle: (force?: boolean) => void;
};

export function toggle(args: ToggleArgs): Toggle {
  let isActive = !!args.isActive;
  const el = document.createElement("button");
  el.classList.add("toggle");
  el.classList.toggle("active", isActive);
  el.addEventListener("click", () => {
    isActive = !isActive;
    el.classList.toggle("active");
    args.onChange(isActive);
  });
  args.container.appendChild(el);

  return {
    isActive: () => isActive,
    toggle: (force?: boolean) => {
      const nextIsActive = force ?? !isActive;
      if (nextIsActive === isActive) return;
      el.classList.toggle("active", force);
      isActive = nextIsActive;
      args.onChange(isActive);
    },
  };
}
