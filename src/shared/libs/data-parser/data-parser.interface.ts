export interface DataParser<SourceData = unknown, ParsedData = unknown> {
  parse(sourceData: SourceData): ParsedData;
}
