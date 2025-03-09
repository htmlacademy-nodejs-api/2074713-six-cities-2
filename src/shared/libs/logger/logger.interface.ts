export interface Logger {
  log(...message: unknown[]): void;
  info(...message: unknown[]): void;
  error(...message: unknown[]): void;
}
