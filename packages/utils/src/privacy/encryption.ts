/**
 * Encryption Service
 *
 * Provides AES-256-GCM encryption for sensitive data (PII).
 * Used to encrypt personal information before database storage.
 *
 * Security features:
 * - AES-256-GCM authenticated encryption
 * - Unique IV per encryption operation
 * - Key derivation using scrypt
 * - Timing-safe comparison for validation
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
  timingSafeEqual,
  createHash,
} from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Encryption constants
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  encrypted: Buffer;
  iv: Buffer;
  authTag: Buffer;
  salt: Buffer;
}

/**
 * Encryption configuration
 */
export interface EncryptionConfig {
  masterKey: string;
  emailPepper?: string;
}

/**
 * Error thrown when encryption/decryption fails
 */
export class EncryptionError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'EncryptionError';
  }
}

/**
 * Validate that a master key meets minimum requirements
 * @param key - Key to validate
 * @throws EncryptionError if key is invalid
 */
export function validateMasterKey(key: string): void {
  if (!key || key.length < 32) {
    throw new EncryptionError(
      'Master key must be at least 32 characters',
      'INVALID_KEY'
    );
  }
}

/**
 * Encrypt sensitive data (PII) before database storage
 * Uses AES-256-GCM with unique IV per encryption
 *
 * @param plaintext - Data to encrypt
 * @param masterKey - Master encryption key
 * @returns Encrypted string in format: salt:iv:authTag:encrypted (all base64)
 */
export async function encryptPII(
  plaintext: string,
  masterKey: string
): Promise<string> {
  validateMasterKey(masterKey);

  if (!plaintext) {
    throw new EncryptionError('Plaintext cannot be empty', 'EMPTY_PLAINTEXT');
  }

  try {
    // Generate unique salt and IV for this encryption
    const salt = randomBytes(SALT_LENGTH);
    const iv = randomBytes(IV_LENGTH);

    // Derive key from master key using scrypt
    const key = (await scryptAsync(masterKey, salt, KEY_LENGTH)) as Buffer;

    // Create cipher and encrypt
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Format: salt:iv:authTag:encrypted (all base64)
    return [
      salt.toString('base64'),
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  } catch (error) {
    if (error instanceof EncryptionError) throw error;
    throw new EncryptionError('Encryption failed', 'ENCRYPTION_FAILED');
  }
}

/**
 * Decrypt PII data retrieved from database
 *
 * @param encryptedString - Encrypted string from encryptPII
 * @param masterKey - Master encryption key
 * @returns Decrypted plaintext
 */
export async function decryptPII(
  encryptedString: string,
  masterKey: string
): Promise<string> {
  validateMasterKey(masterKey);

  if (!encryptedString) {
    throw new EncryptionError(
      'Encrypted string cannot be empty',
      'EMPTY_CIPHERTEXT'
    );
  }

  try {
    const parts = encryptedString.split(':');
    if (parts.length !== 4) {
      throw new EncryptionError('Invalid encrypted format', 'INVALID_FORMAT');
    }

    const [saltB64, ivB64, authTagB64, encryptedB64] = parts;

    const salt = Buffer.from(saltB64, 'base64');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const encrypted = Buffer.from(encryptedB64, 'base64');

    // Validate buffer lengths
    if (salt.length !== SALT_LENGTH) {
      throw new EncryptionError('Invalid salt length', 'INVALID_SALT');
    }
    if (iv.length !== IV_LENGTH) {
      throw new EncryptionError('Invalid IV length', 'INVALID_IV');
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new EncryptionError('Invalid auth tag length', 'INVALID_AUTH_TAG');
    }

    // Derive key from master key using scrypt
    const key = (await scryptAsync(masterKey, salt, KEY_LENGTH)) as Buffer;

    // Create decipher and decrypt
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    if (error instanceof EncryptionError) throw error;
    throw new EncryptionError('Decryption failed', 'DECRYPTION_FAILED');
  }
}

/**
 * Hash email for lookups without exposing actual email
 * Uses deterministic hashing so we can find records
 *
 * @param email - Email to hash
 * @param pepper - Server-side pepper for additional security
 * @returns Hex-encoded hash
 */
export async function hashEmail(email: string, pepper: string): Promise<string> {
  if (!email || !pepper) {
    throw new EncryptionError(
      'Email and pepper are required',
      'MISSING_PARAMETERS'
    );
  }

  const normalizedEmail = email.toLowerCase().trim();
  const hash = (await scryptAsync(normalizedEmail, pepper, 32)) as Buffer;
  return hash.toString('hex');
}

/**
 * Generate a secure random token
 * Used for verification codes, deletion tokens, etc.
 *
 * @param length - Length of token in bytes (default 32)
 * @returns Hex-encoded random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a time-limited verification code
 * Used for email verification, data access requests
 *
 * @param expiryMinutes - Minutes until code expires (default 30)
 * @returns Object with code and expiry timestamp
 */
export function generateVerificationCode(expiryMinutes: number = 30): {
  code: string;
  expiry: Date;
} {
  // 6-digit numeric code for user-friendly entry
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

  return { code, expiry };
}

/**
 * Hash a verification code for secure storage
 * @param code - Verification code to hash
 * @returns SHA-256 hash of the code
 */
export function hashVerificationCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/**
 * Verify a code against its hash using timing-safe comparison
 * @param code - Code to verify
 * @param hash - Stored hash
 * @returns True if code matches hash
 */
export function verifyCode(code: string, hash: string): boolean {
  const inputHash = hashVerificationCode(code);
  try {
    return timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
  } catch {
    return false;
  }
}

/**
 * Mask sensitive data for logging/display
 * Shows first and last few characters with asterisks in between
 *
 * @param data - Data to mask
 * @param showStart - Characters to show at start (default 2)
 * @param showEnd - Characters to show at end (default 2)
 * @returns Masked string
 */
export function maskData(
  data: string,
  showStart: number = 2,
  showEnd: number = 2
): string {
  if (!data || data.length <= showStart + showEnd) {
    return '*'.repeat(data?.length || 0);
  }

  const start = data.slice(0, showStart);
  const end = data.slice(-showEnd);
  const middle = '*'.repeat(Math.min(data.length - showStart - showEnd, 8));

  return `${start}${middle}${end}`;
}

/**
 * Mask email address for display
 * Shows first 2 characters of local part and domain
 *
 * @param email - Email to mask
 * @returns Masked email
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return maskData(email);
  }

  const [local, domain] = email.split('@');
  const maskedLocal =
    local.length > 2 ? local.slice(0, 2) + '*'.repeat(Math.min(local.length - 2, 6)) : local;

  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number for display
 * Shows last 4 digits
 *
 * @param phone - Phone number to mask
 * @returns Masked phone number
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) {
    return '*'.repeat(phone?.length || 0);
  }

  // Remove non-digits for consistent masking
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) {
    return '*'.repeat(phone.length);
  }

  return '*'.repeat(Math.min(digits.length - 4, 8)) + digits.slice(-4);
}

/**
 * Check if a string appears to be encrypted by encryptPII
 * @param data - String to check
 * @returns True if string matches encrypted format
 */
export function isEncrypted(data: string): boolean {
  if (!data) return false;

  const parts = data.split(':');
  if (parts.length !== 4) return false;

  // Check if all parts are valid base64
  try {
    parts.forEach((part) => Buffer.from(part, 'base64'));
    return true;
  } catch {
    return false;
  }
}
