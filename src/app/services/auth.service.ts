import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Response} from "../interfaces/Response";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {WebSocketService} from "./web-socket.service";
import {environment} from "../../environments/environment";
import * as jwt_decode from "jwt-decode";
import {map, switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})

export class AuthService {

  status = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserService,
              private webSocketService: WebSocketService) {}

  public register(data): Observable<any> {
    return this.http.post(environment.SERVER_URL_REG, data);
  }

  public isLoggedIn(): boolean {
    return this.status.value;
  }

  private initUser(data) {
    this.webSocketService.initSocket(data.user.userID, data.user.nick);
    this.userService.currentUser = data.user;
    // this.userService.accessToken = data.accessToken;
    this.status.next(true);
  }

  // public checkToken(): Promise<any> {
  //   return new Promise<any>(res => {
  //     this.http.get(environment.SERVER_URL_TOKEN_CHECK_ACCESS).subscribe((data:Response) => {
  //       if(data.ok) {
  //         const token = jwt_decode(data.accessToken);
  //         this.initUser(data, token);
  //       }
  //       res(data.ok);
  //     });
  //   });
  // }

  public checkSession(): Promise<any> {
    return new Promise<any>(res => {
      this.http.get(environment.SERVER_URL_CHECK_SESSION).subscribe((data: Response) => {
        if(data.ok) {
          this.initUser(data);
        }
        res(data.ok);
      });
    })
  }

  // public refreshToken(): Observable<any> {
  //   const token = localStorage.getItem('refreshToken');
  //     return this.http.post(environment.SERVER_URL_TOKEN_REFRESH, {token}).pipe(map((data: any) =>{
  //       return data;
  //     }))
  // }

  login(value): Promise<Response> {
    return new Promise<Response>(res => {
      this.http.post(environment.SERVER_URL_LOGIN, value).subscribe((data:Response) => {
        if (data.ok) {
          this.initUser(data);
          // localStorage.setItem('refreshToken', data.refreshToken);
        }
        res(data);
      }, error => {
        res({
          ok: false,
          caption: 'Сервер временно недоступен!'
        })
      });
    })
  }

  logout(): void {
    this.http.get(environment.SERVER_URL_LOGOUT).subscribe((data:Response) => {
      if(data.ok) {
        this.webSocketService.disconnectSocket();
        this.status.next(false);
        this.router.navigate(['/login']);
      }
      else {
        console.log(data.caption);
      }
    });

  }
}
