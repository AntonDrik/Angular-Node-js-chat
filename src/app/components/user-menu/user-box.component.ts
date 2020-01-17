import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../interfaces/User";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {WebSocketService} from "../../services/web-socket.service";

@Component({
  selector: 'user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent implements OnInit {

  @Input() user: User;

  constructor(private authService: AuthService,
              private webSocketService: WebSocketService,
              public dialog: MatDialog) { }

  ngOnInit() {}

  showProfile(){
    let dialogRef = this.dialog.open(UserProfileComponent, {
      maxWidth: '800px',
      minWidth: '300px',
      data: {
        user: this.user,
        isEditable: true
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  reconnect() {
    if (this.webSocketService.socket.disconnected){
      this.webSocketService.connectSocket();
    }
  }

}
