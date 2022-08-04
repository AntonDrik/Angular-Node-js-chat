import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../interfaces/Message';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;

  constructor(public dialog: MatDialog, private userService: UserService) {
  }

  ngOnInit() {
  }

  // showImg(login){
  //   let dialogRef = this.dialog.open('<img src="test">', {
  //     maxWidth: '800px',
  //     minWidth: '300px',
  //     data: {
  //       user,
  //       isEditable: false
  //     }
  //   });
  // }

}
