import { CommandName } from '../commands/index.js';

export type ParsedCommand = {
  name: CommandName;
  args: string[];
}
