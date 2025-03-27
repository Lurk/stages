export type RadioArgs = {
  name: string;
  container: HTMLElement;
  selected: string;
  options: string[];
  onChange: (selected: string) => void;
};

export function radio(args: RadioArgs) {
  const { container, selected, options, onChange } = args;

  const rec = document.createElement("div");
  rec.classList.add("radio");
  container.appendChild(rec);

  options.forEach((option) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = args.name;
    radio.value = option;
    radio.checked = option === selected;
    radio.addEventListener("change", () => {
      onChange(option);
    });

    const label = document.createElement("label");
    label.textContent = option;
    label.appendChild(radio);

    rec.appendChild(label);
  });

  return (selected: string) => {
    const radios = rec.querySelectorAll("input");
    radios.forEach((radio) => {
      radio.checked = radio.value === selected;
    });
  };
}
