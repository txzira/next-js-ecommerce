import crypto from "crypto";

export async function genPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { salt, hash: genHash };
}

export function verifyPassword(
  password: string | undefined,
  hash: string | undefined | null,
  salt: string | undefined | null
): boolean {
  if (!password || !hash || !salt) return false;
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hashVerify)
  );

  return isValid;
}
