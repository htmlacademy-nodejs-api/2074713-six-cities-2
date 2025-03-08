import { CommandName } from './command-name.enum.js';

export interface Command {
  readonly name: CommandName;
  execute(...args: string[]): void;
}
