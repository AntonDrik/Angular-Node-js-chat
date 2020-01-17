import {User} from "./User";

export interface Response {
  ok: boolean,
  caption?: string,
  user?: User,
  accessToken?: string,
  refreshToken?: string
}
