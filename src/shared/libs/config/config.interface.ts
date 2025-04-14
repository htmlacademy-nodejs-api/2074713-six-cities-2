export interface Config<KeyToValue extends object> {
  get<Key extends keyof KeyToValue>(key: Key): KeyToValue[Key];
}
