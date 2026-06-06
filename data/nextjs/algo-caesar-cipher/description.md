# algo-caesar-cipher

Implement Caesar cipher encryption, decryption, and brute-force attack.

## Functions to export

### `encrypt(text: string, shift: number): string`
Encrypt `text` by shifting each letter by `shift` positions in the alphabet.
- Only ASCII letters are shifted; digits, spaces, and punctuation are preserved unchanged.
- Case is preserved: uppercase stays uppercase, lowercase stays lowercase.
- `shift` can be any integer (positive, negative, or zero); use modulo 26.
- Example: `encrypt("Hello, World!", 3)` → `"Khoor, Zruog!"`.

### `decrypt(text: string, shift: number): string`
Decrypt a Caesar-encrypted string by reversing the shift.
- Equivalent to `encrypt(text, -shift)`.
- `decrypt(encrypt(s, k), k) === s` for any string `s` and integer `k`.

### `bruteForce(text: string): Array<{ shift: number; text: string }>`
Return all 26 possible decryptions (shift 0 through 25), each as `{ shift, text }`.
- Index 0 has shift 0 (no change), index 25 has shift 25.
- Useful for manually identifying the correct decryption.

## Edge cases
- Empty string returns `""`.
- Shift of 0 returns the original text.
- Shift of 26 (or any multiple of 26) returns the original text.
- Negative shifts wrap correctly.
- Non-letter characters are never changed.
