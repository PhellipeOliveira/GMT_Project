/** Agrupa palavras por offsetTop para obter linhas visuais após wrap. */
export function splitTextIntoLines(
  container: HTMLElement,
  text: string,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [text];

  container.replaceChildren();

  const segments: { top: number; text: string }[] = [];

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + (index < words.length - 1 ? " " : "");
    span.style.display = "inline";
    container.appendChild(span);
    segments.push({ top: span.offsetTop, text: span.textContent ?? "" });
  });

  const lines: string[] = [];
  let current = "";
  let lastTop = segments[0]?.top ?? 0;

  for (const { top, text: segment } of segments) {
    if (top !== lastTop && current) {
      lines.push(current.trimEnd());
      current = segment;
      lastTop = top;
    } else {
      current += segment;
      lastTop = top;
    }
  }

  if (current) lines.push(current.trimEnd());

  return lines.length ? lines : [text];
}
