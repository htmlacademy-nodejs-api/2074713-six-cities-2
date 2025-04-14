import 'reflect-metadata';
import { Container } from 'inversify';

import { Application } from './rest/application/index.js';
import { Component } from './shared/types/index.js';
import { Config, RestApplicationConfigSchema, RestApplicationConfig } from './shared/libs/config/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';

bootstrap();

function bootstrap() {
  const container = createContainer();

  try {
    initApplication(container);
  } catch (error) {
    handleApplicationInitializationError(container, error);
  }
}

function createContainer(): Container {
  const container = new Container();

  container.bind<Application>(Component.RestApplication)
    .to(Application)
    .inSingletonScope();
  container.bind<Config<RestApplicationConfigSchema>>(Component.Config)
    .to(RestApplicationConfig)
    .inSingletonScope();
  container.bind<Logger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();

  return container;
}

function initApplication(container: Container): void | never {
  container.get<Application>(Component.RestApplication).init();
}

function handleApplicationInitializationError(
  container: Container,
  error: unknown
): void {
  const logger = container.get<Logger>(Component.Logger);
  logger.error('Не удалось запустить приложение');

  if (error instanceof Error) {
    logger.error(error);
  }
}
