export interface DataGenerator<SourceData = unknown, GeneratedData = unknown> {
  setSourceData(sourceData: SourceData): void;
  generate(): GeneratedData;
}
