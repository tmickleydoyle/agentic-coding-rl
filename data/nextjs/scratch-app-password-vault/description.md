# Password Vault

A credential manager to store site passwords, generate strong passwords, audit weak entries, and configure settings.

## Routes
- **/** — Vault: list all credentials, add/remove entries
- **/generate** — Password generator with length and character options
- **/audit** — List credentials flagged as weak (password length < 12)
- **/settings** — Configure vault settings (auto-lock timeout, password policy)

## Features
- Add/remove credentials (site, username, password, url, category, notes)
- Generate random passwords by length, with/without symbols
- Audit shows entries with password shorter than 12 chars
- Copy password to clipboard (simulate via state)
- Settings: auto-lock (number), requireSymbols (boolean)

## Data Model
- Credential: id, site, username, password, url, category, notes, createdAt
- Settings: autoLockMinutes (number), requireSymbols (boolean)
