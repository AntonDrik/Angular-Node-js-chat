import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {UserBoxComponent} from './components/user-menu/user-box.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {MessageComponent} from './components/chat/message/message.component';
import {AvatarInputComponent} from './components/user-profile/avatar-input/avatar-input.component';
import {SpinnerComponent} from './components/common/spinner/spinner.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {ChatComponent} from './components/chat/chat.component';

import {JWTInterceptor} from './helpers/interceptors/JWT-interceptor.component';
import {AuthService} from './services/auth.service';
import {AppRoutingModule, AuthGuard} from './app-routing.module';
import {AttachPreviewComponent} from './components/chat/attach-preview/attach-preview.component';
import {DialogComponent} from './components/common/dialog/dialog.component';
import {AvatarComponent} from './components/common/avatar/avatar.component';
import {AttachInputComponent} from './components/chat/attach-input/attach-input.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserBoxComponent,
    UserProfileComponent,
    MessageComponent,
    AvatarInputComponent,
    AttachInputComponent,
    ChatComponent,
    AttachPreviewComponent,
    SpinnerComponent,
    DialogComponent,
    AvatarComponent
  ],
  entryComponents: [
    UserProfileComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
