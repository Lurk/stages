type ButtonArgs = {
  text: string;
  container: HTMLElement;
  onClick: () => void;
};

export function button({ text, container, onClick }: ButtonArgs) {
  const rec = document.createElement("button");
  rec.textContent = text;
  rec.addEventListener("click", onClick);
  container.appendChild(rec);

  return (text: string) => {
    rec.textContent = text;
  };
}
