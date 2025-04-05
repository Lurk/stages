type ButtonArgs = {
  text: string;
  container: HTMLElement;
  onClick: () => void;
};

export function button({ text, container, onClick }: ButtonArgs) {
  const el = document.createElement("button");
  el.textContent = text;
  el.addEventListener("click", onClick);
  container.appendChild(el);

  return (text: string) => {
    el.textContent = text;
  };
}
