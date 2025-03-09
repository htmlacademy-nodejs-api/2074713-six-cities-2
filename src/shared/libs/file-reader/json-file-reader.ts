import { extname } from 'node:path';
import { readFileSync } from 'node:fs';

import { JSONData } from '../../types/index.js';
import { FileReader } from './file-reader.interface.js';
import { FileExtension } from './file-extension.enum.js';

export class JSONFileReader implements FileReader<JSONData> {
  public read(filePath: string): JSONData | never {
    if (!this.checkIfFileFormatValid(filePath)) {
      throw new Error(
        `Некорректный формат JSON-файла: ${filePath}\nОжидается файл с расширением ${FileExtension.JSON}`
      );
    }

    const rawContent = this.readRawContent(filePath);
    return this.parseRawContent(rawContent);
  }

  private checkIfFileFormatValid(filePath: string): boolean {
    return extname(filePath) === FileExtension.JSON;
  }

  private readRawContent(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
  }

  private parseRawContent(rawContent: string): JSONData | never {
    return JSON.parse(rawContent);
  }
}
