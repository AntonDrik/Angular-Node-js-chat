import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../interfaces/User';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() user: User;

  path = '';

  constructor() {
  }

  ngOnInit() {
    this.path = `avatar/${this.user.avatar}`;
  }

  handleError() {
    this.path = 'assets/images/avatar-icon.png';
  }

}
