import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly SERVER_URL: string = 'http://localhost:3001';
  currentUser:User;
  selectedUser:User;

  constructor(private http: HttpClient) {}

}
