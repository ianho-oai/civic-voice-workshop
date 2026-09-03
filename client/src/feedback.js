export const MAX_FEEDBACK_LENGTH = 500;

export function isFeedbackWithinLimit(message) {
  return message.length <= MAX_FEEDBACK_LENGTH;
}
