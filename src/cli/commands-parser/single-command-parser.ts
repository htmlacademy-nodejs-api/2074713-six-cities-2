import { CommandName } from '../commands/index.js';
import { CommandsParser } from './commands-parser.interface.js';
import { ParsedCommand } from './parsed-command.type.js';

const COMMAND_NAME_PREFIX = '--';

export class SingleCommandParser implements CommandsParser {
  public parse(argv: string[]): ParsedCommand[] | never {
    const [_execPath, _filePath, commandName, ...commandArgs] = argv;

    if (!commandName) {
      return [];
    }

    if (!this.checkIfCommandNameValid(commandName)) {
      throw new Error(`Некорректное название команды: ${commandName}`);
    }

    return [
      {
        name: commandName as CommandName,
        args: commandArgs
      }
    ];
  }

  private checkIfCommandNameValid(commandName: string): boolean {
    return commandName.startsWith(COMMAND_NAME_PREFIX);
  }
}
