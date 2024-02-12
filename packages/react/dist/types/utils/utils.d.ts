export declare const getProviders: () => Promise<Record<string, {
    id: string;
    name: string;
    type: string;
    callbackUrl: string;
    signInUrl: string;
}>>;
