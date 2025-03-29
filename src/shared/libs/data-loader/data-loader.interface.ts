export interface DataLoader<LoadedData = unknown> {
  load(url: string): Promise<LoadedData>;
}
