import { Command } from './command.interface.js';
import { ImportCommandDeps } from './import-command-deps.type.js';
import { CommandName } from './command-name.enum.js';

export class ImportCommand implements Command {
  public readonly name: CommandName = CommandName.Import;

  constructor(
    private readonly deps: ImportCommandDeps
  ) {}

  public execute(...args: string[]): void | never {
    const [filePath] = args;

    if (!filePath) {
      throw new Error('Для импорта данных необходимо указать источник');
    }

    try {
      this.importDataFromFile(filePath);
    } catch (error) {
      this.handleImportError(filePath, error);
    }
  }

  private importDataFromFile(filePath: string): void | never {
    const sourceData = this.deps.fileReader.read(filePath);
    const parsedData = this.deps.dataParser.parse(sourceData);
    // TODO: логирование заменить на настоящий импорт
    this.deps.logger.log(parsedData);
  }

  private handleImportError(filePath: string, error: unknown): void {
    this.deps.logger.error(`Не удалось импортировать данные из файла ${filePath}`);

    if (error instanceof Error) {
      this.deps.logger.error(error.message);
    }
  }
}
