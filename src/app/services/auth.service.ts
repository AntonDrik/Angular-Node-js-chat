import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Response} from "../interfaces/response";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  readonly SERVER_URL_REG: string = 'http://localhost:3001/api/register';
  readonly SERVER_URL_LOG: string = 'http://localhost:3001/api/login';
  // readonly SERVER_URL_REG: string = '/api/register';
  // readonly SERVER_URL_LOG: string = '/api/login';

  constructor(private router: Router, private http: HttpClient) {}

  status = new BehaviorSubject<boolean>(false);

  public register(data): Observable<any> {
    return this.http.post(this.SERVER_URL_REG, data);
  }

  public isLoggedIn(): Observable<boolean> {
    return this.status.asObservable();
  }

  getUser(): string {
    return localStorage.getItem('userName');
  }

  login(value): Promise<Response> {
    return new Promise<Response>((res) => {
      this.http.post(this.SERVER_URL_LOG, value).subscribe((data: Response) => {
        if (data.ok) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', value.login);
          this.status.next(true);
          this.router.navigate(['/chat']);
        }
        res(data);
      });
    });
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userName');
    this.status.next(false);
  }
}
