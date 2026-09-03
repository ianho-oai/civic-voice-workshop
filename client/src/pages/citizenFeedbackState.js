export const initialFeedbackState = {
  message: "",
  submitted: false,
  error: "",
};

export function feedbackReducer(state, action) {
  switch (action.type) {
    case "messageChanged":
      return { ...state, message: action.message };
    case "submissionSucceeded":
      return { ...state, message: "", submitted: true, error: "" };
    case "submissionFailed":
      return { ...state, error: action.error };
    case "startAnother":
      return { ...state, submitted: false, error: "" };
    default:
      return state;
  }
}
