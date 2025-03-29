import { Logger } from '../../shared/libs/logger/index.js';
import { DataLoader } from '../../shared/libs/data-loader/index.js';
import { DataGenerator } from '../../shared/libs/data-generator/index.js';
import { StreamFileWriter } from '../../shared/libs/stream-file-writer/index.js';

export type GenerateCommandDeps<SourceData = unknown, DestinationData = unknown> = {
  logger: Logger;
  sourceDataLoader: DataLoader<SourceData>;
  destinationDataGenerator: DataGenerator<SourceData, DestinationData>;
  destinationFileWriter: StreamFileWriter<DestinationData>;
}
