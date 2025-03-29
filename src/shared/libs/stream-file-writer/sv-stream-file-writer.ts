import { extname } from 'node:path';
import { WriteStream, createWriteStream } from 'node:fs';

import { FileExtension, SVRecord, SVValuesSeparator } from '../../types/index.js';
import {
  SV_VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP,
  SV_RECORDS_SEPARATOR,
  SV_BUFFER_CAPACITY_IN_BYTES
} from '../../consts/index.js';
import { StreamFileWriter } from './stream-file-writer.interface.js';

export class SVStreamFileWriter implements StreamFileWriter<SVRecord> {
  private stream: null | WriteStream = null;

  constructor(
    private readonly valuesSeparator: SVValuesSeparator = SVValuesSeparator.Comma
  ) {}

  public open(path: string): void | never {
    if (!this.checkIfFileExtensionSuitable(path)) {
      throw new Error(
        `Неподходящий формат файла ${path}\nОжидается файл с расширением ${this.getSuitableFileExtension()}`
      );
    }

    this.openStream(path);
  }

  public write(record: SVRecord): Promise<void> | never {
    if (!this.stream) {
      throw new Error('Перед записью в файл необходимо установить соединение');
    }

    return this.writeToStream(record);
  }

  private checkIfFileExtensionSuitable(path: string): boolean {
    return extname(path) === this.getSuitableFileExtension();
  }

  private getSuitableFileExtension(): FileExtension {
    return SV_VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP[this.valuesSeparator];
  }

  private openStream(path: string): void | never {
    this.stream = createWriteStream(path, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: SV_BUFFER_CAPACITY_IN_BYTES,
      autoClose: true
    });
  }

  private writeToStream(record: SVRecord): Promise<void> {
    const stream = this.stream!;

    const isBufferNotFull = stream.write(
      this.formatRecordBeforeWriting(record)
    );

    return isBufferNotFull
      ? Promise.resolve()
      : new Promise((resolve) => stream.once('drain', resolve));
  }

  private formatRecordBeforeWriting(record: SVRecord): string {
    return `${record.join(this.valuesSeparator)}${SV_RECORDS_SEPARATOR}`;
  }
}
