import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./components/login/login.component";
import {ChatComponent} from "./components/chat/chat.component";
import {getSortHeaderNotContainedWithinSortError} from "@angular/material/sort/typings/sort-errors";
import has = Reflect.has;


@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise((res) => {
      this.authService.checkSession().then(hasSession => {
        if(!hasSession) {
          this.router.navigate(['/login']);
        }
        res(hasSession);
      })
      // if(this.authService.isLoggedIn()) {
      //   res(true)
      // }
      // else {
      //   this.authService.checkToken().then(isValid => {
      //     if(isValid) {
      //       res(true)
      //     }
      //     else {
      //       this.router.navigate(['/login']);
      //       res(false);
      //     }
      //   });
      // }
    });

  }
}

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    component: ChatComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo: 'chat' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
