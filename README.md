# FullAuth

<p><img src="docs/public/brand/fullauth-mark.svg" width="64" height="64" alt="FullAuth brand mark" /></p>

FullAuth is a TypeScript authentication library with packages for a shared provider core, Next.js route handling, and React and React Native session helpers.

## Packages and implemented capabilities

- `@fullauth/core`: shared provider types and utilities, credentials-provider configuration, Google provider implementation, and JWT/session helpers.
- `@fullauth/next`: Next.js route handler and server-session helper.
- `@fullauth/react`: React session context, hooks, and sign-in/sign-out helpers.
- `@fullauth/react-native`: React Native session helpers and authentication headers.

Credentials verification is supplied by the application. Google OAuth provider code is present; review its setup and limitations in the documentation and test your integration before relying on it. No other built-in OAuth providers are included. FullAuth does not provide database adapters, MFA, or role management.

## Documentation

Start at [FullAuth documentation](https://full-auth.vercel.app/). The repository's [examples](https://github.com/A-AllaaEddine/fullauth/tree/main/examples) are reference projects; check their README files and dependency versions before using them.

## License

[MIT](LICENCE)
