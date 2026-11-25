# FullAuth Next.js example

This is a reference scaffold, not a ready-to-run authentication service. Its `package.json` points to local FullAuth `2.2.0` tarballs that are present in this repository. Those dependencies predate the current `2.2.1` package version. The app compiled with Next.js 15.5.6, but its build typecheck fails because the archived Next helper expects an `AuthOptions` argument while the current repository source accepts the secret string. The example source follows the current repository implementation; do not mix it with the older archive API.

Before using it:

- Replace the placeholder credential callback with verification against your own user store and password-hash scheme. The example does not provide user storage or password verification.
- Set `FULLAUTH_SECRET` on the server and `NEXT_PUBLIC_FULLAUTH_URL` to the backend origin used by browser helpers.
- Review the token callback before allowing session updates. Only copy fields that the application has validated and intends to permit.
- Do not use this project as a production security template.

`getServerSession` takes the secret string, so server examples pass `authOptions.secret`. No middleware integration is shown: the helper uses `next/headers`, and middleware compatibility is not established by this source or audit. Keep `authOptions` in a normal module; Next.js route files reject extra named exports.

The package archive references are intentionally left unchanged because package manifests and versions are outside this documentation refinement.
