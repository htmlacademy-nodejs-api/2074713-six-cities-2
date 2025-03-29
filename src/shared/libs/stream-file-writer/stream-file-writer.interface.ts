export interface StreamFileWriter<ContentChunk = unknown> {
  open(path: string): void;
  write(contentChunk: ContentChunk): Promise<void>;
}
