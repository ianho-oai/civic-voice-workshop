export function maskIdentifier(identifier) {
  if (typeof identifier !== "string" || identifier.length === 0) return "";
  if (identifier.length <= 3) return "•".repeat(identifier.length);

  return `${identifier[0]}${"•".repeat(identifier.length - 3)}${identifier.slice(-2)}`;
}
