import { Injectable }   from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent
}                       from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  throwError }          from 'rxjs';
import { switchMap}     from 'rxjs/operators';
import { catchError }   from 'rxjs/operators';
import { AuthService }  from "../../services/auth.service";
import { UserService }  from "../../services/user.service";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private userService: UserService) { }

  addToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.userService.accessToken) {
      const accessToken = this.userService.accessToken;
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
      })
    }
    else {
      return request;
    }

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {

    console.log(request.url);

    request = request.clone({
      withCredentials: true
    });
    return next.handle(request).pipe(
      catchError((err) => {
        if(err.status === 401) {
          this.authService.logout();
        }
        return throwError(err.statusText);
      })
    );

    // if(request.url.includes('refreshToken') || request.url.includes('login')) {
    //   return next.handle(request);
    // }

    // if(request.url.includes('checkToken') || request.url.includes('api')) {
    //   return next.handle(this.addToken(request)).pipe(
    //
    //     catchError((err) => {
    //       // INVALID ACCESS TOKEN. GET NEW TOKEN VIA REFRESH TOKEN
    //       if(err.status === 401) {
    //         return this.authService.refreshToken().pipe(
    //           switchMap((data: any) => {
    //             // REFRESH TOKEN IS VALID. SET NEW ACCESS AND REFRESH TOKEN
    //             if(data.ok) {
    //               this.userService.accessToken = data.accessToken;
    //               localStorage.setItem('refreshToken', data.refreshToken);
    //               return next.handle(this.addToken(request));
    //             }
    //             // REFRESH TOKEN IS INVALID. LOGOUT
    //             this.authService.logout();
    //           }),
    //           catchError((err) => {
    //             // REFRESH TOKEN IS INVALID. LOGOUT
    //             this.authService.logout();
    //             return throwError(err.statusText);
    //           })
    //         );
    //       }
    //       return throwError(err.statusText);
    //     })
    //
    //   );
    // }

  }
}
