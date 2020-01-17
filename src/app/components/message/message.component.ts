import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../interfaces/Message";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/User";

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;

  constructor(public dialog: MatDialog, private userService: UserService) { }

  ngOnInit() {
  }

  showProfile(login){
    this.userService.getUser(login).then((user:User) => {
      let dialogRef = this.dialog.open(UserProfileComponent, {
        maxWidth: '800px',
        minWidth: '300px',
        data: {
          user,
          isEditable: false
        }
      });
    }).catch(err => {
      console.log(err);
    });

  }

}
