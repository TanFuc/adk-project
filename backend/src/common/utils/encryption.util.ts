import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

function getKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }
  // Use scrypt to derive a proper 32-byte key from the encryption key
  return scryptSync(encryptionKey, 'adk-salt', KEY_LENGTH);
}

export function encrypt(text: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const key = getKey();
  const textParts = text.split(':');
  const ivHex = textParts.shift();
  if (!ivHex) {
    throw new Error('Invalid encrypted text format');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = textParts.join(':');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hashForSearch(text: string): string {
  // Create a deterministic hash for searching without decrypting
  const key = getKey();
  const cipher = createCipheriv(ALGORITHM, key, Buffer.alloc(IV_LENGTH, 0));
  let hash = cipher.update(text, 'utf8', 'hex');
  hash += cipher.final('hex');
  return hash;
}
