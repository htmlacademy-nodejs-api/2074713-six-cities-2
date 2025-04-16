import chalk from 'chalk';

import { Logger } from './logger.interface.js';

const INFO_THEME = chalk.blue;
const WARN_THEME = chalk.bold.bgYellow;
const ERROR_THEME = chalk.bold.bgRed;
const DEBUG_THEME = chalk.bold.bgBlack;

export class ChalkLogger implements Logger {
  public info(message: unknown, ...args: unknown[]): void {
    console.info(INFO_THEME(message, ...args));
  }

  public warn(message: unknown, ...args: unknown[]): void {
    console.warn(WARN_THEME(message, ...args));
  }

  public error(message: unknown, ...args: unknown[]): void {
    console.error(ERROR_THEME(message, ...args));
  }

  public debug(message: unknown, ...args: unknown[]): void {
    console.debug(DEBUG_THEME(message, ...args));
  }
}
