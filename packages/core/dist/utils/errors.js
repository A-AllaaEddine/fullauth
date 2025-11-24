export class BaseError extends Error {
    //   /** The name of the error */
    //   name: string;
    constructor(message = 'Internal Server Error', type = 'InternalError', body) {
        super();
        this.message = message;
        this.type = type;
        this.body = body;
        // this.name = this.constructor.name;
        // Capture the stack trace, excluding this constructor
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toJSON() {
        return {
            type: this.type,
            message: this.message,
            ...(this.body && { body: this.body }),
        };
    }
    toString() {
        return `${this.type}: ${this.message}`;
    }
}
// Define a specific error type within the class
export class CredentialError extends BaseError {
    constructor(message = 'Credentials Error', body) {
        super(message, 'CredentialError', body);
    }
}
export class CustomError extends BaseError {
    constructor(message = 'Custom Error', body) {
        super(message, 'CustomError', body);
    }
}
export class InvalidProviderError extends BaseError {
    constructor(message = 'Invalid Provider', body) {
        super(message, 'InvalidProvider', body);
    }
}
export class InternaError extends BaseError {
    constructor(message = 'Internal Error', body) {
        super(message, 'InternalError', body);
    }
}
export class TokenError extends BaseError {
    constructor(message = 'Token Callback Error', body) {
        super(message, 'TokenError', body);
    }
}
export class OAuthCallbackError extends BaseError {
    constructor(message = 'OAuth Callback Error', body) {
        super(message, 'OAuthCallbackError', body);
    }
}
export class OAuthRedirectError extends BaseError {
    constructor(message = 'OAuth Invalid Redirect URL', body) {
        super(message, 'OAuthRedirectError', body);
    }
}
export class MethodNotAllowedError extends BaseError {
    constructor(message = 'Method not allowed', body) {
        super(message, 'MethodNotAllowedError', body);
    }
}
export class SessionTokenError extends BaseError {
    constructor(message = 'Invalid Session Token', body) {
        super(message, 'SessionTokenError', body);
    }
}
export class CsrfTokenError extends BaseError {
    constructor(message = 'Invalid CSRF Token', body) {
        super(message, 'CsrfTokenError', body);
    }
}
