import { hash, compare, genSalt } from "bcryptjs";

export async function hashPassword(password: string) {
  const salt = await genSalt(15);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
// admin
//home - menu
{
  /*
Sign up
login
signup success
order page
order success

*/
}
