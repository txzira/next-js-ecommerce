import { hash, compare, genSalt } from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(password: string) {
  const salt = await genSalt(15);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export function validatePassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hashVerify)
  );

  return isValid;
}

// admin
//home - menu
{
  /*

signup success
order page
order success

*/
}
