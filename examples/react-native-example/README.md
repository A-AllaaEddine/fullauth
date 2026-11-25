# FullAuth React Native example

This is a reference scaffold, not a currently verified app. Its package manifest pins `@fullauth/core` and `@fullauth/react-native` to `^0.0.5`, which predates the current API. The app source has been updated to the current object-form `signIn({ baseUrl, provider, credentials })` and `signOut({ baseUrl })` signatures, but its dependency set has not been refreshed and the app was not built or run as part of this audit.

Set `EXPO_PUBLIC_FULLAUTH_URL` to your backend origin. Implement credential verification and any token update policy in the backend app; this example does not provide a user store or password verification. The FullAuth React Native sign-in helper does not complete Google OAuth redirects, even though a mobile callback path exists in provider source.

The package version pins are intentionally unchanged because package manifests and release versions are outside this documentation refinement.
