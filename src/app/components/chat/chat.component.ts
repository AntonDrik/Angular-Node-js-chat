import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../interfaces/User';
import {Message} from '../../interfaces/Message';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {WebSocketService} from '../../services/web-socket.service';
import {UserService} from '../../services/user.service';
import {environment} from '../../../environments/environment';
import {Howl} from 'howler';
import {atLeastOne} from '../../helpers/validators/atLeastOne';
import {AttachFileService} from '../../services/attach-file.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('inputElement', {static: true}) inputElementRef: ElementRef;

  sendLoading = false;
  chatForm: FormGroup;
  messages: Message[] = [];
  users: [] = [];
  currUser: User;

  sound = new Howl({
    src: ['/assets/sound/notification.wav'],
    format: 'wav'
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private webSocketService: WebSocketService,
    private userService: UserService,
    private attachFileService: AttachFileService
  ) {
    if (this.authService.isLoggedIn()) {
      this.initSocket();
      this.currUser = this.userService.currentUser;
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initSocket() {
    this.webSocketService.onConnect().subscribe(() => {
      this.loadMessages();
    });

    this.webSocketService.onDisconnect().subscribe((reason) => {
      console.log(reason);
    });

    this.webSocketService.onMessage().subscribe((message: Message) => {
      this.sound.play();
      this.messages.push(message);
    });

    this.webSocketService.onOnlineUsers().subscribe(users => {
      this.users = users;
    });

    this.webSocketService.onEvent('connect_error').subscribe((err) => {
      console.log(err);
      alert('Server is not available now');
      this.authService.logout();
    });
  }

  loadMessages() {
    this.http.get(environment.SERVER_URL_MESSAGES_GET).subscribe((data: []) => {
      this.messages = data.reverse();
    });
  }

  initForm() {
    this.chatForm = this.fb.group({
      text: ['', Validators.minLength(1)],
      file: [null]
    }, {validator: atLeastOne(Validators.required, ['text', 'file'])});
  }

  sendMessage() {
    const currUser = this.userService.currentUser;
    const controls = this.chatForm.controls;
    if (this.chatForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    const formData = new FormData();
    formData.append('userID', currUser.userID);
    formData.append('nick', currUser.nick);
    formData.append('text', this.chatForm.value.text);
    formData.append('file', this.chatForm.value.file);
    this.sendLoading = true;
    this.http.post(environment.SERVER_URL_MESSAGES_ADD, formData)
      .subscribe(() => {
        this.chatForm.reset('text', {onlySelf: true});
        this.chatForm.reset('file', {onlySelf: true});
        this.attachFileService.clear();
        // this.areaElementRef.nativeElement.focus();
        this.sendLoading = false;
      });
  }

  handleChange(event: KeyboardEvent) {
    if (this.webSocketService.socket.disconnected) {
      this.webSocketService.connectSocket();
    }
    if (event.code === 'Enter') {
      event.stopPropagation();
      this.sendMessage();
    }
  }

}
