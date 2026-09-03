const WORKSHOP_NRIC_PATTERN = /^[ST]\d{7}[A-Z]$/i;

export function isValidWorkshopNric(value) {
  return WORKSHOP_NRIC_PATTERN.test(value.trim());
}
