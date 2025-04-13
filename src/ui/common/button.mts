type ButtonArgs = {
  text: string;
  container: HTMLElement;
  onClick?: () => void;
  onHold?: () => void;
  disabled?: boolean;
};

export type Button = {
  toggleDisabled: (force?: boolean) => void;
  setText: (text: string) => void;
};

export function button({
  text,
  container,
  onClick,
  onHold,
  disabled,
}: ButtonArgs): Button {
  const el = document.createElement("button");
  el.textContent = text;
  if (onClick) {
    el.addEventListener("click", onClick);
  }

  if (onHold) {
    let interval = 300;
    let timeoutIdId: NodeJS.Timeout | null = null;

    const wrap = () => {
      onHold();
      interval = Math.max(100, interval - 10);
      timeoutIdId = setTimeout(wrap, interval);
    };

    el.addEventListener("mousedown", () => {
      wrap();
    });

    el.addEventListener("mouseup", () => {
      if (timeoutIdId !== null) {
        clearTimeout(timeoutIdId);
        timeoutIdId = null;
      }
      interval = 300;
    });
  }

  el.disabled = disabled ?? false;
  container.appendChild(el);

  return {
    setText: (text) => {
      el.textContent = text;
    },
    toggleDisabled: (force) => {
      el.disabled = force ?? !el.disabled;
    },
  };
}
