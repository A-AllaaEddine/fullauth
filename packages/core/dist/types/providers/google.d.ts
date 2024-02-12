import { OAuthConfig, OAuthProvider } from '../types/types';
export interface GoogleConfig extends OAuthConfig {
}
export interface GoogleProvider extends OAuthProvider {
}
export declare function GoogleProvider(options: GoogleConfig): GoogleProvider;
