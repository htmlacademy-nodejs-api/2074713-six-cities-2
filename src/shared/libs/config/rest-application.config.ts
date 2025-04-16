import { injectable, inject } from 'inversify';
import { config } from 'dotenv';

import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { RestApplicationConfigSchema } from './rest-application-config-schema.type.js';
import { restApplicationConfigSchema } from './rest-application-config.schema.js';

@injectable()
export class RestApplicationConfig implements Config<RestApplicationConfigSchema> {
  private readonly envVars: RestApplicationConfigSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    const configOutput = config();

    if (configOutput.error) {
      throw configOutput.error;
    }

    this.envVars = restApplicationConfigSchema
      .load({})
      .validate({ allowed: 'strict', output: this.logger.error })
      .getProperties();

    this.logger.info('Конфигурация приложения успешно считана из файла .env');
  }

  public get<Key extends keyof RestApplicationConfigSchema>(
    key: Key
  ): RestApplicationConfigSchema[Key] {
    return this.envVars[key];
  }
}
