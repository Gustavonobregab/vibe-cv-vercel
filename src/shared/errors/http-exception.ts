import { HttpStatus } from './http-status'

export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'HttpException'
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class InvalidInputException extends HttpException {
  constructor(message: string = 'Invalid input provided') {
    super(message, HttpStatus.BAD_REQUEST)
  }
}

export class MissingRequiredFieldException extends HttpException {
  constructor(field: string) {
    super(`Missing required field: ${field}`, HttpStatus.BAD_REQUEST)
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor(message: string = 'Invalid credentials') {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}

export class TokenExpiredException extends HttpException {
  constructor(message: string = 'Token has expired') {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}

export class InsufficientPermissionsException extends HttpException {
  constructor(permission: string) {
    super(`Insufficient permissions: ${permission}`, HttpStatus.FORBIDDEN)
  }
}

export class DuplicateResourceException extends HttpException {
  constructor(resource: string) {
    super(`${resource} already exists`, HttpStatus.CONFLICT)
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export class RateLimitExceededException extends HttpException {
  constructor(limit: number, period: string) {
    super(`Rate limit of ${limit} requests per ${period} exceeded`, HttpStatus.TOO_MANY_REQUESTS)
  }
}

export class DatabaseErrorException extends HttpException {
  constructor(message: string) {
    super(`Database error: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export class MaintenanceModeException extends HttpException {
  constructor(message: string = 'Service is under maintenance') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE)
  }
} 