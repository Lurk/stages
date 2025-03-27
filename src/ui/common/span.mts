export function spanWithText(
  container: HTMLDivElement,
  text: string,
): (text: string) => void {
  const span = document.createElement("span");
  span.innerText = text;
  container.appendChild(span);

  return (text: string) => {
    span.innerText = text;
  };
}
