import {
  ContentChunkReadEventDescriptor,
  ContentReadEventDescriptor
} from '../../shared/libs/stream-file-reader/index.js';
import { Command } from './command.interface.js';
import { ImportCommandDeps } from './import-command-deps.type.js';
import { CommandName } from './command-name.enum.js';

export class ImportCommand<SourceData = unknown, DestinationData = unknown> implements Command {
  public readonly name: CommandName = CommandName.Import;

  constructor(
    private readonly deps: ImportCommandDeps<SourceData, DestinationData>
  ) {}

  public async execute(...args: string[]): Promise<void> | never {
    const [sourcePath] = args;

    if (!sourcePath) {
      throw new Error('Для импорта данных необходимо указать sourcePath');
    }

    try {
      await this.importDataFromSource(sourcePath);
    } catch (error) {
      this.handleImportError(error);
    }
  }

  private async importDataFromSource(sourcePath: string): Promise<void> | never {
    this.deps.sourceFileReader.on('contentChunkRead', this.contentChunkReadEventListener);
    this.deps.sourceFileReader.on('contentRead', this.contentReadEventListener);
    this.deps.sourceFileReader.open(sourcePath);
    await this.deps.sourceFileReader.read();
  }

  private contentChunkReadEventListener = (eventDescriptor: ContentChunkReadEventDescriptor<SourceData>) => {
    const parsedData = this.deps.sourceDataParser.parse(eventDescriptor.contentChunk);
    // TODO: логирование заменить на настоящий импорт
    this.deps.logger.info(parsedData);
  };

  private contentReadEventListener = (eventDescriptor: ContentReadEventDescriptor) => {
    this.deps.logger.info(`Импортировано записей: ${eventDescriptor.contentChunksCount}`);
  };

  private handleImportError(error: unknown): void {
    this.deps.logger.error('Не удалось импортировать данные');

    if (error instanceof Error) {
      this.deps.logger.error(error.stack);
    }
  }
}
