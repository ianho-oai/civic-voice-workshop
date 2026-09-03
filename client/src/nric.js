const NRIC_PATTERN = /^[STFG]\d{7}[A-Z]$/;

export function normalizeNric(value) {
  return value.trim().toUpperCase();
}

export function validateNric(value) {
  return NRIC_PATTERN.test(normalizeNric(value))
    ? ""
    : "Enter a valid NRIC-like ID, for example S0000001A.";
}
