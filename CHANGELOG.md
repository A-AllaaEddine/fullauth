# Changelog

This file records changes supported by the repository's tagged history. A Git tag does not by itself establish that every package was published at that version; package-specific publication evidence is summarized in `website-review/refinement-04/changelog-verification.md`.

## Unreleased — website and documentation

- Refined documentation syntax highlighting and corrected examples and capability descriptions.
- Added page metadata, canonical URLs, social metadata, sitemap, robots configuration, and a generated Open Graph image.

## v2.2.1

- Fixed a `getServerSession` issue (tag `v2.2.1`).

## v2.2.0

- Fixed Next.js 15 route-handler issues (tag `v2.2.0`).

## v2.1.1

- Fixed Next.js 16 support (tag `v2.1.1`).

## v2.1.0

- Added Next.js 16 support work (tag `v2.1.0`).

## v2.0.0

- Added support for Next.js 15 (tag `v2.0.0`).

## v1.2.1

- Fixed package exports and set the cookie `SameSite` attribute to `lax` (tag `v1.2.1`).

## v1.2.0

- Replaced `jsonwebtoken` with `jose` for Vercel Edge compatibility (tag `v1.2.0`).

## v1.1.2

- Type fixes (tag `v1.1.2`).

## v1.1.1

- Fixed types (tag `v1.1.1`).

## v1.1.0

- Made `baseUrl` required in the relevant React Native integration APIs (tag `v1.1.0`).

## v1.0.2

- Fixed token-callback platform types and made the React Native `SessionProvider` `baseUrl` optional (tag `v1.0.2`).

## v1.0.1

- Added the `platform` property to the token callback (tag `v1.0.1`).

## v1.0.0

- Reworked internal functions, added the Google provider, fixed web session refresh after sign-in/sign-out, and added post-sign-in redirection (tag `v1.0.0`).
