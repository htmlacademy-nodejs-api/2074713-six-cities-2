import { ParsedCommand } from './parsed-command.type.js';

export interface CommandsParser {
  parse(argv: string[]): ParsedCommand[];
}
