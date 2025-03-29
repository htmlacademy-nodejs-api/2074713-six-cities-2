import { ContentChunkReadEventDescriptor } from './content-chunk-read-event-descriptor.type.js';
import { ContentReadEventDescriptor } from './content-read-event-descriptor.type.js';

export interface StreamFileReader<ContentChunk = unknown> {
  open(path: string): void;
  read(): Promise<void>;
  on(
    eventName: 'contentChunkRead',
    eventListener: (eventDescriptor: ContentChunkReadEventDescriptor<ContentChunk>) => void
  ): void;
  on(
    eventName: 'contentRead',
    eventListener: (eventDescriptor: ContentReadEventDescriptor) => void
  ): void;
}
