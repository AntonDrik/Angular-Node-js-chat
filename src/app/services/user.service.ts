import { Injectable }   from '@angular/core';
import {HttpClient}     from "@angular/common/http";
import {User}           from "../interfaces/User";
import {Response}       from "../interfaces/Response";
import {environment}    from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UserService {

  currentUser:User;
  accessToken: string;

  constructor(private http: HttpClient) {}

  getUser(userID): Promise<User> {
    const URL = `${environment.SERVER_URL_USER_GET}/${userID}`;
    return new Promise((res, rej) => {
      this.http.get(URL).subscribe((data: Response) => {
        (data.ok) ? res(data.user) : rej(data.caption);
      }, error => {
        rej(error)
      });
    });
  }

  updateUser(data): Promise<Response> {
    data.userID = this.currentUser.userID;
    return new Promise((res, rej) => {
      this.http.post(environment.SERVER_URL_USER_EDIT, data).subscribe((data: Response) => {
        if (data.ok) {
          this.currentUser = data.user;
          res(data);
        }
        else {
          rej(data);
        }
      }, error => {
        rej(error);
      })
    })
  }

}
