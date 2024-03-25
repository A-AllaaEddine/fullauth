export declare const getProviders: ({ baseUrl }: {
    baseUrl?: string | undefined;
}) => Promise<Record<string, {
    id: string;
    name: string;
    type: string;
    callbackUrl: string;
    signInUrl: string;
}>>;
