import { Awaitable, CommonProviderOptions, User } from '../types/types';

export function CredentialsProvider<
  C extends Record<string, CredentialInput> = Record<string, CredentialInput>
>(options: UserCredentialsConfig<C>): CredentialsConfig<C> {
  return {
    id: options.id ?? 'credentials',
    name: 'credentials',
    type: 'credentials',
    credentials: {} as any,
    signIn: options.signIn,
    options,
  };
}

export type CredentialInput = {
  type: 'text' | 'password';
};

export interface CredentialsConfig<
  C extends Record<string, CredentialInput> = Record<string, CredentialInput>
> extends CommonProviderOptions {
  type: 'credentials';
  credentials: C;
  signIn: (credentials: Record<keyof C, string>) => Awaitable<User | null>;
  options: UserCredentialsConfig<C>;
}

export type UserCredentialsConfig<C extends Record<string, CredentialInput>> =
  Partial<Omit<CredentialsConfig<C>, 'options'>> &
    Pick<CredentialsConfig<C>, 'signIn' | 'credentials'>;

export type CredentialsProvider = <C extends Record<string, CredentialInput>>(
  options: Partial<CredentialsConfig<C>>
) => CredentialsConfig<C>;
