export function hasFeedbackContent(message) {
  return typeof message === "string" && message.trim().length > 0;
}

export function getInboxSummary(feedback) {
  return feedback.reduce((summary, item) => {
    summary.total += 1;
    if (item.status === "New") summary.new += 1;
    if (item.status === "In review") summary.inReview += 1;
    if (item.status === "Closed") summary.closed += 1;
    return summary;
  }, { total: 0, new: 0, inReview: 0, closed: 0 });
}
