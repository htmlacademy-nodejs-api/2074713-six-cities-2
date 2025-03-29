import EventEmitter from 'node:events';
import { extname } from 'node:path';
import { ReadStream, createReadStream } from 'node:fs';

import { FileExtension, SVRecord, SVValuesSeparator } from '../../types/index.js';
import {
  SV_VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP,
  SV_RECORDS_SEPARATOR,
  SV_BUFFER_CAPACITY_IN_BYTES
} from '../../consts/index.js';
import { StreamFileReader } from './stream-file-reader.interface.js';
import { StreamFileReaderEventName } from './stream-file-reader-event-name.enum.js';
import { ContentChunkReadEventDescriptor } from './content-chunk-read-event-descriptor.type.js';
import { ContentReadEventDescriptor } from './content-read-event-descriptor.type.js';

const MISSING_POSITION = -1;

export class SVStreamFileReader extends EventEmitter implements StreamFileReader<SVRecord> {
  private stream: null | ReadStream = null;

  constructor(
    private readonly valuesSeparator: SVValuesSeparator = SVValuesSeparator.Comma
  ) {
    super();
  }

  public open(path: string): void | never {
    if (!this.checkIfFileExtensionSuitable(path)) {
      throw new Error(
        `Неподходящий формат файла ${path}\nОжидается файл с расширением ${this.getSuitableFileExtension()}`
      );
    }

    this.openStream(path);
  }

  public read(): Promise<void> | never {
    if (!this.stream) {
      throw new Error('Перед чтением из файла необходимо установить соединение');
    }

    return this.readFromStream();
  }

  private checkIfFileExtensionSuitable(path: string): boolean {
    return extname(path) === this.getSuitableFileExtension();
  }

  private getSuitableFileExtension(): FileExtension {
    return SV_VALUES_SEPARATOR_TO_FILE_EXTENSION_MAP[this.valuesSeparator];
  }

  private openStream(path: string): void | never {
    this.stream = createReadStream(path, {
      encoding: 'utf-8',
      highWaterMark: SV_BUFFER_CAPACITY_IN_BYTES,
      autoClose: true
    });
  }

  private async readFromStream(): Promise<void> {
    let readContent = '';
    let readContentChunksCount = 0;
    let recordsSeparatorPosition = MISSING_POSITION;

    for await (const contentChunk of this.stream!) {
      readContent += contentChunk;

      while (
        (recordsSeparatorPosition = readContent.indexOf(SV_RECORDS_SEPARATOR)) !== MISSING_POSITION
      ) {
        const record = this.formatRecordAfterReading(
          readContent.slice(0, recordsSeparatorPosition)
        );
        readContent = readContent.slice(recordsSeparatorPosition + 1);
        readContentChunksCount++;
        this.emitContentChunkReadEvent({ contentChunk: record });
      }
    }

    this.emitContentReadEvent({ contentChunksCount: readContentChunksCount });
  }

  private formatRecordAfterReading(record: string): SVRecord {
    return record.split(this.valuesSeparator);
  }

  private emitContentChunkReadEvent(eventDescriptor: ContentChunkReadEventDescriptor): void {
    this.emit(StreamFileReaderEventName.ContentChunkRead, eventDescriptor);
  }

  private emitContentReadEvent(eventDescriptor: ContentReadEventDescriptor): void {
    this.emit(StreamFileReaderEventName.ContentRead, eventDescriptor);
  }
}
