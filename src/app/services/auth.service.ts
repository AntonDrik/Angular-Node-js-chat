import {BehaviorSubject, Observable} from "rxjs";

export class AuthService {

  status = new BehaviorSubject<boolean>(false);

  public isLoggedIn(): Observable<boolean> {
      return this.status.asObservable();
  }

  login(value): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', value);
    this.status.next(true);
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userName');
    this.status.next(false);
  }
}
