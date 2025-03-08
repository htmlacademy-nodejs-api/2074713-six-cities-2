import { Command } from './command.interface.js';
import { HelpCommandDeps } from './help-command-deps.type.js';
import { CommandName } from './command-name.enum.js';

const MANUAL = `
  Приложение для подготовки данных для REST API сервера

  Пример: cli.js --<command> [--arguments]

  Команды:
    --help:                      # вывод этого текста
    --version:                   # вывод версии
    --import <path>:             # импорт данных из источника
    --generate <n> <path> <url>  # генерация произвольного количества тестовых данных
`;

export class HelpCommand implements Command {
  public readonly name: CommandName = CommandName.Help;

  constructor(
    private readonly deps: HelpCommandDeps
  ) {}

  public execute(): void {
    this.deps.logger.info(MANUAL);
  }
}
