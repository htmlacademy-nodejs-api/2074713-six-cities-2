#!/usr/bin/env node

import { Application } from './cli/application/index.js';
import { SingleCommandParser } from './cli/commands-parser/index.js';
import { Command, HelpCommand, VersionCommand, GenerateCommand, ImportCommand } from './cli/commands/index.js';
import { SVValuesSeparator, SVValuePartsSeparator } from './shared/types/index.js';
import { ChalkLogger } from './shared/libs/logger/index.js';
import { OffersSourceDataLoader } from './shared/libs/data-loader/index.js';
import { OfferSVRecordGenerator } from './shared/libs/data-generator/index.js';
import { SVStreamFileWriter } from './shared/libs/stream-file-writer/index.js';
import { SVStreamFileReader } from './shared/libs/stream-file-reader/index.js';
import { SVRecordToOfferParser } from './shared/libs/data-parser/index.js';

const logger = new ChalkLogger();

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
  const generateCommand = new GenerateCommand({
    logger,
    sourceDataLoader: new OffersSourceDataLoader(),
    destinationDataGenerator: new OfferSVRecordGenerator(SVValuePartsSeparator.Comma),
    destinationFileWriter: new SVStreamFileWriter(SVValuesSeparator.Tab)
  });
  const importCommand = new ImportCommand({
    logger,
    sourceFileReader: new SVStreamFileReader(SVValuesSeparator.Tab),
    sourceDataParser: new SVRecordToOfferParser(SVValuePartsSeparator.Comma)
  });

  return [helpCommand, versionCommand, generateCommand, importCommand];
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
    logger.error(error.stack);
  }
}

function processCommands(application: Application): void | never {
  application.processCommands(process.argv);
}

function handleCommandsProcessingError(error: unknown): void {
  logger.error('Не удалось обработать команды приложения');

  if (error instanceof Error) {
    logger.error(error.stack);
  }
}
