export function getMagicLinkErrorKey(error) {
  if (
    error?.code === "over_email_send_rate_limit" ||
    error?.status === 429
  ) {
    return "rate-limited";
  }

  return "login-failed";
}
