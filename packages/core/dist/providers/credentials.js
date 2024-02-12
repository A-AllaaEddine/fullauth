export function CredentialsProvider(options) {
    return {
        id: options.id ?? 'credentials',
        name: 'credentials',
        type: 'credentials',
        credentials: {},
        signIn: options.signIn,
        options,
    };
}
