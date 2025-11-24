export type ErrorOptions = Error | Record<string, unknown>;

export type ErrorType =
  | 'CredentialError'
  | 'CustomError'
  | 'InternalError'
  | 'InvalidProvider'
  | 'TokenError'
  | 'OAuthCallbackError'
  | 'OAuthRedirectError'
  | 'MethodNotAllowedError'
  | 'SessionTokenError'
  | 'CsrfTokenError';

export type CustomErrorType = {
  type: ErrorType;
  message: string;
  body?: Record<string, any>;
};
export class BaseError extends Error {
  /** The error message */
  message: string;
  /** The error type */
  type: ErrorType;
  /** Additional error options */
  body?: ErrorOptions;
  //   /** The name of the error */
  //   name: string;

  constructor(
    message: string = 'Internal Server Error',
    type: ErrorType = 'InternalError',
    body?: ErrorOptions
  ) {
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
  constructor(message: string = 'Credentials Error', body?: ErrorOptions) {
    super(message, 'CredentialError', body);
  }
}

export class CustomError extends BaseError {
  constructor(message: string = 'Custom Error', body?: ErrorOptions) {
    super(message, 'CustomError', body);
  }
}

export class InvalidProviderError extends BaseError {
  constructor(message: string = 'Invalid Provider', body?: ErrorOptions) {
    super(message, 'InvalidProvider', body);
  }
}

export class InternaError extends BaseError {
  constructor(message: string = 'Internal Error', body?: ErrorOptions) {
    super(message, 'InternalError', body);
  }
}
export class TokenError extends BaseError {
  constructor(message: string = 'Token Callback Error', body?: ErrorOptions) {
    super(message, 'TokenError', body);
  }
}
export class OAuthCallbackError extends BaseError {
  constructor(message: string = 'OAuth Callback Error', body?: ErrorOptions) {
    super(message, 'OAuthCallbackError', body);
  }
}
export class OAuthRedirectError extends BaseError {
  constructor(
    message: string = 'OAuth Invalid Redirect URL',
    body?: ErrorOptions
  ) {
    super(message, 'OAuthRedirectError', body);
  }
}
export class MethodNotAllowedError extends BaseError {
  constructor(message: string = 'Method not allowed', body?: ErrorOptions) {
    super(message, 'MethodNotAllowedError', body);
  }
}

export class SessionTokenError extends BaseError {
  constructor(message: string = 'Invalid Session Token', body?: ErrorOptions) {
    super(message, 'SessionTokenError', body);
  }
}
export class CsrfTokenError extends BaseError {
  constructor(message: string = 'Invalid CSRF Token', body?: ErrorOptions) {
    super(message, 'CsrfTokenError', body);
  }
}
