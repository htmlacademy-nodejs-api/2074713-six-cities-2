import { injectable } from 'inversify';
import { Logger as PinoInstance, LogFn, pino } from 'pino';

import { Logger } from './logger.interface.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly instance: PinoInstance = pino();

  public info(message: unknown, ...args: unknown[]): void {
    this.instance.info(
      ...this.formatArgsForInstance(message, ...args)
    );
  }

  public warn(message: unknown, ...args: unknown[]): void {
    this.instance.warn(
      ...this.formatArgsForInstance(message, ...args)
    );
  }

  public error(message: unknown, ...args: unknown[]): void {
    this.instance.error(
      ...this.formatArgsForInstance(message, ...args)
    );
  }

  public debug(message: unknown, ...args: unknown[]): void {
    this.instance.debug(
      ...this.formatArgsForInstance(message, ...args)
    );
  }

  private formatArgsForInstance(message: unknown, ...args: unknown[]): Parameters<LogFn> {
    if (typeof message === 'string') {
      return [message, ...args] as Parameters<LogFn>;
    }

    return (
      args.length ? [message, String(args[0]), ...args.slice(1)] : [message]
    ) as Parameters<LogFn>;
  }
}
