export interface SyncFileReader<Content = unknown> {
  read(path: string): Content;
}
