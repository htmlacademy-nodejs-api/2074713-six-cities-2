#!/usr/bin/env node

import { Application } from './cli/application/index.js';
import { SingleCommandParser } from './cli/commands-parser/index.js';
import { Command, HelpCommand, VersionCommand, ImportCommand } from './cli/commands/index.js';
import { ColoredLogger } from './shared/libs/logger/index.js';
import { SVFileReader, ValuesSeparator } from './shared/libs/file-reader/index.js';
import { SVToOffersParser } from './shared/libs/data-parser/index.js';

const logger = new ColoredLogger();

bootstrap();

function bootstrap() {
  const application = createApplication();
  const commands = createCommands();

  try {
    registerCommands(application, commands);
  } catch (error) {
    handleCommandsRegistrationError(error);
    return;
  }

  try {
    processCommands(application);
  } catch (error) {
    handleCommandsProcessingError(error);
  }
}

function createApplication(): Application {
  return new Application({
    commandsParser: new SingleCommandParser()
  });
}

function createCommands(): Command[] {
  const helpCommand = new HelpCommand({ logger });
  const versionCommand = new VersionCommand({ logger });
  const importCommand = new ImportCommand({
    logger,
    fileReader: new SVFileReader(ValuesSeparator.Tab),
    dataParser: new SVToOffersParser()
  });

  return [helpCommand, versionCommand, importCommand];
}

function registerCommands(
  application: Application,
  commands: Command[]
): void | never {
  application.registerCommands(commands);
}

function handleCommandsRegistrationError(error: unknown): void {
  logger.error('Не удалось зарегистрировать команды приложения');

  if (error instanceof Error) {
    logger.error(error.message);
  }
}

function processCommands(application: Application): void | never {
  application.processCommands(process.argv);
}

function handleCommandsProcessingError(error: unknown): void {
  logger.error('Не удалось обработать команды приложения');

  if (error instanceof Error) {
    logger.error(error.message);
  }
}
