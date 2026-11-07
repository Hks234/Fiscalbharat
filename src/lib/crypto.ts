import "server-only";
import { createHash, randomBytes, randomInt } from "crypto";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashSessionToken(token: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set.");
  }
  return sha256(`${secret}:${token}`);
}

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export function generateTemporaryPassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*";
  const all = `${upper}${lower}${numbers}${symbols}`;
  const chars = [
    upper[randomInt(upper.length)],
    lower[randomInt(lower.length)],
    numbers[randomInt(numbers.length)],
    symbols[randomInt(symbols.length)],
  ];
  for (let i = 0; i < 12; i += 1) {
    chars.push(all[randomInt(all.length)]);
  }
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function generateClientCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[randomInt(alphabet.length)];
  }
  return `FB-${suffix}`;
}
