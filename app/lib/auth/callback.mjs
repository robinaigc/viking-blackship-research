/**
 * @typedef {{ kind: "code", code: string }} CodeCredentials
 * @typedef {{ kind: "otp", tokenHash: string, type: "magiclink" | "signup" }} OtpCredentials
 * @typedef {{ kind: "session", accessToken: string, refreshToken: string }} SessionCredentials
 * @typedef {{ kind: "missing" }} MissingCredentials
 * @typedef {CodeCredentials | OtpCredentials | SessionCredentials | MissingCredentials} AuthCallbackCredentials
 */

/**
 * @param {string} value
 * @returns {AuthCallbackCredentials}
 */
export function getAuthCallbackCredentials(value) {
  const url = new URL(value);
  const code = url.searchParams.get("code");
  if (code) return { kind: "code", code };

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (tokenHash && (type === "magiclink" || type === "signup")) {
    return { kind: "otp", tokenHash, type };
  }

  const fragment = new URLSearchParams(url.hash.replace(/^#/, ""));
  const accessToken = fragment.get("access_token");
  const refreshToken = fragment.get("refresh_token");
  if (accessToken && refreshToken) {
    return { kind: "session", accessToken, refreshToken };
  }

  return { kind: "missing" };
}
