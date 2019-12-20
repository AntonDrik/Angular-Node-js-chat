import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  // readonly SERVER_URL: string = 'http://localhost:3001/api/register';
  readonly SERVER_URL: string = '/api/register';

  constructor(private http: HttpClient) {}

  register(data): Observable<any> {
    return this.http.post(this.SERVER_URL, data);
  }
}
