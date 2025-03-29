import { Command } from './command.interface.js';
import { GenerateCommandDeps } from './generate-command-deps.type.js';
import { CommandName } from './command-name.enum.js';

export class GenerateCommand<SourceData = unknown, DestinationData = unknown> implements Command {
  public readonly name: CommandName = CommandName.Generate;

  constructor(
    private readonly deps: GenerateCommandDeps<SourceData, DestinationData>
  ) {}

  public async execute(...args: string[]): Promise<void> | never {
    const [quantityString, destinationPath, sourceURL] = args;
    const quantity = +quantityString;

    if (!sourceURL || !destinationPath || !quantity) {
      throw new Error(
        'Для генерации данных необходимо указать sourceURL, destinationPath и quantity'
      );
    }

    try {
      await this.generateDataFromSourceToDestination(sourceURL, destinationPath, quantity);
    } catch (error) {
      this.handleGenerationError(error);
    }
  }

  private async generateDataFromSourceToDestination(
    sourceURL: string,
    destinationPath: string,
    quantity: number
  ): Promise<void> | never {
    const sourceData = await this.deps.sourceDataLoader.load(sourceURL);
    this.deps.destinationDataGenerator.setSourceData(sourceData);
    this.deps.destinationFileWriter.open(destinationPath);

    for (let i = 0; i < quantity; i++) {
      await this.deps.destinationFileWriter.write(
        this.deps.destinationDataGenerator.generate()
      );
    }
  }

  private handleGenerationError(error: unknown): void {
    this.deps.logger.error('Не удалось сгенерировать данные');

    if (error instanceof Error) {
      this.deps.logger.error(error.stack);
    }
  }
}
