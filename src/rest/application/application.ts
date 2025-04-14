import { injectable, inject } from 'inversify';

import { Component } from '../../shared/types/index.js';
import { Config, RestApplicationConfigSchema } from '../../shared/libs/config/index.js';
import { Logger } from '../../shared/libs/logger/index.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestApplicationConfigSchema>,
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public init(): void {
    this.logger.info('Запуск приложения прошел успешно');
    this.logger.info(`Приложение ожидает подключения на ${this.config.get('PORT')} порте`);
  }
}
