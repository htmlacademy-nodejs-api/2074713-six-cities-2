import { extname } from 'node:path';
import { readFileSync } from 'node:fs';

import { FileExtension, JSONData } from '../../types/index.js';
import { SyncFileReader } from './sync-file-reader.interface.js';

export class JSONSyncFileReader implements SyncFileReader<JSONData> {
  public read(path: string): JSONData | never {
    if (!this.checkIfFileExtensionSuitable(path)) {
      throw new Error(
        `Неподходящий формат файла ${path}\nОжидается файл с расширением ${FileExtension.JSON}`
      );
    }

    const rawContent = this.readRawContent(path);
    return this.parseRawContent(rawContent);
  }

  private checkIfFileExtensionSuitable(path: string): boolean {
    return extname(path) === FileExtension.JSON;
  }

  private readRawContent(path: string): string | never {
    return readFileSync(path, 'utf-8');
  }

  private parseRawContent(rawContent: string): JSONData | never {
    return JSON.parse(rawContent);
  }
}
