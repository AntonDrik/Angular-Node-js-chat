import {User} from './User';

export interface Message {
  user: User[];
  text: string;
  filePath?: any;
  date?: Date;
}
