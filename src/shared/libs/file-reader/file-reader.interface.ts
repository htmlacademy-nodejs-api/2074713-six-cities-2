export interface FileReader<Content = unknown> {
  read(filePath: string): Content;
}
