import { Logger } from '../../shared/libs/logger/index.js';
import { StreamFileReader } from '../../shared/libs/stream-file-reader/index.js';
import { DataParser } from '../../shared/libs/data-parser/index.js';

export type ImportCommandDeps<SourceData = unknown, DestinationData = unknown> = {
  logger: Logger;
  sourceFileReader: StreamFileReader<SourceData>;
  sourceDataParser: DataParser<SourceData, DestinationData>;
}
