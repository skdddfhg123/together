export function hexToRgba(hex: string) {
  if (!hex || hex.length < 9) return hex;
  hex = hex.replace('#', '');

  const a = parseInt(hex.substring(0, 2), 16) / 255;
  const r = parseInt(hex.substring(2, 4), 16);
  const g = parseInt(hex.substring(4, 6), 16);
  const b = parseInt(hex.substring(6, 8), 16);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
