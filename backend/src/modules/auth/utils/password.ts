import bcrypt from 'bcrypt';
import { env } from '../../../config/env';

const DUMMY_PASSWORD_HASH = '$2b$12$9Qh3V9x2E5G58oMYBKrr8u/D1a1JONgQTq0fCFh.O7hJ1EzYhJx8S';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function performDummyPasswordCheck(password: string): Promise<boolean> {
  return bcrypt.compare(password, DUMMY_PASSWORD_HASH);
}
