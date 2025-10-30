export class AppError extends Error {
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) { super(message); this.name = 'AppError'; this.cause = cause; }
}
export class NetworkError extends AppError { constructor(message = 'Network error', cause?: unknown) { super(message, cause); this.name='NetworkError'; } }
export class TimeoutError extends AppError { constructor(message = 'Request timed out', cause?: unknown) { super(message, cause); this.name='TimeoutError'; } }
export class CircuitOpenError extends AppError { constructor(message = 'Circuit open', cause?: unknown) { super(message, cause); this.name='CircuitOpenError'; } }
export class ServerError extends AppError { status: number; constructor(status: number, message = 'Server error') { super(message); this.name='ServerError'; this.status = status; } }
