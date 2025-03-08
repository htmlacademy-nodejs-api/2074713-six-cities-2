import { extname } from 'node:path';
import { readFileSync } from 'node:fs';

import { SVRecord } from '../../types/index.js';
import { FileReader } from './file-reader.interface.js';
import { FileExtension } from './file-extension.enum.js';
import { ValuesSeparator } from './values-separator.enum.js';

const VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP = {
  [ValuesSeparator.Comma]: FileExtension.CSV,
  [ValuesSeparator.Tab]: FileExtension.TSV
};

const RECORDS_SEPARATOR = '\n';

export class SVFileReader implements FileReader<SVRecord[]> {
  constructor(
    private readonly valuesSeparator: ValuesSeparator = ValuesSeparator.Comma
  ) {}

  public read(filePath: string): SVRecord[] | never {
    if (!this.checkIfFileFormatValid(filePath)) {
      const fileExtension = VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP[this.valuesSeparator];

      throw new Error(
        `Некорректный формат файла: ${filePath}\nОжидается файл с расширением ${fileExtension}`
      );
    }

    const rawContent = this.readRawContent(filePath);
    return this.parseRawContent(rawContent);
  }

  private checkIfFileFormatValid(filePath: string): boolean {
    return extname(filePath) === VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP[this.valuesSeparator];
  }

  private readRawContent(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
  }

  private parseRawContent(rawContent: string): SVRecord[] {
    return rawContent
      .trim()
      .split(RECORDS_SEPARATOR)
      .map((record) => record.split(this.valuesSeparator));
  }
}
