import { Logger } from '../../shared/libs/logger/index.js';
import { FileReader } from '../../shared/libs/file-reader/index.js';
import { DataParser } from '../../shared/libs/data-parser/index.js';

export type ImportCommandDeps = {
  logger: Logger;
  fileReader: FileReader;
  dataParser: DataParser;
}
