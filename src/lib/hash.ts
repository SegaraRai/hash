import { arrayBufferToHex } from './arrayBufferToHex';

export type DigestAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export function isSupported(): boolean {
  return !!(
    window.TextEncoder &&
    window.Uint8Array &&
    window.crypto?.subtle?.digest
  );
}

export async function calcHash(
  src: string,
  algorithm: DigestAlgorithm
): Promise<string | undefined> {
  if (!isSupported()) {
    return undefined;
  }
  return arrayBufferToHex(
    await crypto.subtle.digest(algorithm, new TextEncoder().encode(src))
  );
}
