import { resolve } from 'node:path';

import { JSONSyncFileReader } from '../../shared/libs/sync-file-reader/index.js';
import { JSONData, PackageConfig } from '../../shared/types/index.js';
import { Command } from './command.interface.js';
import { VersionCommandDeps } from './version-command-deps.type.js';
import { CommandName } from './command-name.enum.js';

const CONFIG_FILE_PATH = resolve('./package.json');

export class VersionCommand implements Command {
  public readonly name: CommandName = CommandName.Version;
  private readonly configFileReader: JSONSyncFileReader = new JSONSyncFileReader();

  constructor(
    private readonly deps: VersionCommandDeps
  ) {}

  public execute(): void {
    try {
      this.logVersionFromConfigFile();
    } catch (error) {
      this.handleVersionReadingError(error);
    }
  }

  private logVersionFromConfigFile(): void | never {
    const config = this.configFileReader.read(CONFIG_FILE_PATH);

    if (!this.checkIfConfigValid(config)) {
      throw new Error('Некорректный формат конфигурации приложения');
    }

    this.deps.logger.info(`v${config.version}`);
  }

  private checkIfConfigValid(config: JSONData): config is PackageConfig {
    return (
      config !== null
      && typeof config === 'object'
      && !Array.isArray(config)
      && Object.hasOwn(config, 'version')
    );
  }

  private handleVersionReadingError(error: unknown): void {
    this.deps.logger.error(`Не удалось прочитать версию в конфигурационном файле ${CONFIG_FILE_PATH}`);

    if (error instanceof Error) {
      this.deps.logger.error(error.stack);
    }
  }
}
