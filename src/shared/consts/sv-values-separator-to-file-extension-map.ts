import { FileExtension, SVValuesSeparator } from '../types/index.js';

export const SV_VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP = {
  [SVValuesSeparator.Comma]: FileExtension.CSV,
  [SVValuesSeparator.Tab]: FileExtension.TSV
}
