import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isLogged;
    this.authService.isLoggedIn().subscribe(status => {
      isLogged = status;
    });
    if (isLogged) {
      return true
    }
    this.router.navigate(['/login']);
    return false;
  }
}

const routes: Routes = [
  {
    path: '', redirectTo: 'chat', pathMatch: 'full'
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    component: AppComponent,
    data: {
      login: false
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      login: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
