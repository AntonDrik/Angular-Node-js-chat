import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../interfaces/Message';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../services/user.service';
import {DialogComponent} from '../../common/dialog/dialog.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  showImg() {
    this.dialog.open(DialogComponent, {
      data: {src: this.filePath}
    });
  }

  get filePath() {
    return `static/${this.message.filePath}`;
  }

}
