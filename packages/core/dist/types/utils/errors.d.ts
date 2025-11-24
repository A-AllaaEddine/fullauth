export type ErrorOptions = Error | Record<string, unknown>;
export type ErrorType = 'CredentialError' | 'CustomError' | 'InternalError' | 'InvalidProvider' | 'TokenError' | 'OAuthCallbackError' | 'OAuthRedirectError' | 'MethodNotAllowedError' | 'SessionTokenError' | 'CsrfTokenError';
export type CustomErrorType = {
    type: ErrorType;
    message: string;
    body?: Record<string, any>;
};
export declare class BaseError extends Error {
    /** The error message */
    message: string;
    /** The error type */
    type: ErrorType;
    /** Additional error options */
    body?: ErrorOptions;
    constructor(message?: string, type?: ErrorType, body?: ErrorOptions);
    toJSON(): {
        body?: ErrorOptions | undefined;
        type: ErrorType;
        message: string;
    };
    toString(): string;
}
export declare class CredentialError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class CustomError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class InvalidProviderError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class InternaError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class TokenError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class OAuthCallbackError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class OAuthRedirectError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class MethodNotAllowedError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class SessionTokenError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
export declare class CsrfTokenError extends BaseError {
    constructor(message?: string, body?: ErrorOptions);
}
