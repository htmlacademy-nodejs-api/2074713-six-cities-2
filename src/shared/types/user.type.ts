import { UserType } from './user-type.enum.js';

export type User = {
  type: UserType;
  name: string;
  email: string;
  password: string;
  avatar: string;
}
