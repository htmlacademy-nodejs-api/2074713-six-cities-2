import chalk from 'chalk';

import { Logger } from './logger.interface.js';

const INFO_THEME = chalk.blue;
const ERROR_THEME = chalk.bold.bgRed;

export class ColoredLogger implements Logger {
  public log(...message: unknown[]): void {
    console.log(...message);
  }

  public info(...message: unknown[]): void {
    console.info(INFO_THEME(...message));
  }

  public error(...message: unknown[]): void {
    console.error(ERROR_THEME(...message));
  }
}
