import { HttpStatus } from '../enums/http-status-code'

// Base Exception Class
export class HttpException extends Error {
  public readonly code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
    Object.setPrototypeOf(this, HttpException.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

// 400 Bad Request Exceptions
export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST)
  }
}

export class InvalidInputException extends BadRequestException {
  constructor(message: string) {
    super(`Invalid input: ${message}`)
  }
}

export class MissingRequiredFieldException extends BadRequestException {
  constructor(field: string) {
    super(`Missing required field: ${field}`)
  }
}

export class InvalidFormatException extends BadRequestException {
  constructor(field: string, format: string) {
    super(`Invalid ${field} format. Expected: ${format}`)
  }
}

// 401 Unauthorized Exceptions
export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid credentials')
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token has expired')
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super('Invalid token')
  }
}

// 403 Forbidden Exceptions
export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN)
  }
}

export class InsufficientPermissionsException extends ForbiddenException {
  constructor(requiredPermission: string) {
    super(`Insufficient permissions. Required: ${requiredPermission}`)
  }
}

export class ResourceAccessDeniedException extends ForbiddenException {
  constructor(resource: string) {
    super(`Access denied to resource: ${resource}`)
  }
}

// 404 Not Found Exceptions
export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND)
  }
}

export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string) {
    super(`${resource} not found`)
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`)
  }
}

// 409 Conflict Exceptions
export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT)
  }
}

export class DuplicateResourceException extends ConflictException {
  constructor(resource: string) {
    super(`${resource} already exists`)
  }
}

export class ResourceInUseException extends ConflictException {
  constructor(resource: string) {
    super(`${resource} is currently in use`)
  }
}

// 422 Unprocessable Entity Exceptions
export class UnprocessableEntityException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export class ValidationException extends UnprocessableEntityException {
  constructor(message: string) {
    super(`Validation failed: ${message}`)
  }
}

export class InvalidStateException extends UnprocessableEntityException {
  constructor(message: string) {
    super(`Invalid state: ${message}`)
  }
}

// 429 Too Many Requests Exceptions
export class TooManyRequestsException extends HttpException {
  constructor(message: string = 'Too many requests') {
    super(message, HttpStatus.TOO_MANY_REQUESTS)
  }
}

export class RateLimitExceededException extends TooManyRequestsException {
  constructor(limit: number, window: string) {
    super(`Rate limit exceeded. Maximum ${limit} requests per ${window}`)
  }
}

// 500 Internal Server Error Exceptions
export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export class DatabaseErrorException extends InternalServerErrorException {
  constructor(message: string) {
    super(`Database error: ${message}`)
  }
}

export class ExternalServiceErrorException extends InternalServerErrorException {
  constructor(service: string, message: string) {
    super(`${service} service error: ${message}`)
  }
}

// 503 Service Unavailable Exceptions
export class ServiceUnavailableException extends HttpException {
  constructor(message: string = 'Service Unavailable') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE)
  }
}

export class MaintenanceModeException extends ServiceUnavailableException {
  constructor() {
    super('Service is currently under maintenance')
  }
}

export class DatabaseConnectionException extends ServiceUnavailableException {
  constructor() {
    super('Database connection unavailable')
  }
}

// Keep the existing exceptions...
export class MethodNotAllowedException extends HttpException {
  constructor(message = 'Method Not Allowed') {
    super(message, HttpStatus.METHOD_NOT_ALLOWED)
  }
}

export class NotAcceptableException extends HttpException {
  constructor(message = 'Not Acceptable') {
    super(message, HttpStatus.NOT_ACCEPTABLE)
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message = 'Request Timeout') {
    super(message, HttpStatus.REQUEST_TIMEOUT)
  }
}

export class GoneException extends HttpException {
  constructor(message = 'Gone') {
    super(message, HttpStatus.GONE)
  }
}

export class PayloadTooLargeException extends HttpException {
  constructor(message = 'Payload Too Large') {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE)
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  constructor(message = 'Unsupported Media Type') {
    super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE)
  }
}

export class NotImplementedException extends HttpException {
  constructor(message = 'Not Implemented') {
    super(message, HttpStatus.NOT_IMPLEMENTED)
  }
}

export class BadGatewayException extends HttpException {
  constructor(message = 'Bad Gateway') {
    super(message, HttpStatus.BAD_GATEWAY)
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.GATEWAY_TIMEOUT)
  }
}

export class HttpVersionNotSupportedException extends HttpException {
  constructor(message = 'HTTP Version Not Supported') {
    super(message, HttpStatus.HTTP_VERSION_NOT_SUPPORTED)
  }
}

export class ImATeapotException extends HttpException {
  constructor(message = "I'm a teapot") {
    super(message, HttpStatus.IM_A_TEAPOT)
  }
}

export class PreconditionFailedException extends HttpException {
  constructor(message = 'Precondition Failed') {
    super(message, HttpStatus.PRECONDITION_FAILED)
  }
} 