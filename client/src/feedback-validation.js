export function hasFeedbackContent(message) {
  return typeof message === "string" && message.trim().length > 0;
}
