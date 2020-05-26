import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../interfaces/User";
import {Message} from "../../interfaces/Message";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {WebSocketService} from "../../services/web-socket.service";
import {UserService} from "../../services/user.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('mbox', {static: false}) private mbox: ElementRef;

  chatForm: FormGroup;
  messages: Message[] = [];
  users: [] = [];
  currUser: User;
  disableScrollDown = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private fb: FormBuilder,
              private http: HttpClient,
              private webSocketService: WebSocketService,
              private userService: UserService) {
    if(this.authService.isLoggedIn()) {
      this.initSocket();
      this.currUser = this.userService.currentUser;
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initSocket(){
    this.webSocketService.onConnect().subscribe( () => {
//       this.loadMessages();
    });

    this.webSocketService.onDisconnect().subscribe((reason) => {
      console.log(reason);
    });

    this.webSocketService.onMessage().subscribe((message:Message) => {
      this.messages.push(message);
    });

    this.webSocketService.onOnlineUsers().subscribe(users => {
      this.users = users;
    });

    this.webSocketService.onEvent('connect_error').subscribe(() => {
      alert('Server is not available now');
      this.authService.logout();
    });
  }

  loadMessages(){
    this.http.get(environment.SERVER_URL_MESSAGES_GET).subscribe((data:[]) => {
      this.messages = data.reverse();
      this.scrollToBottom();
    });
  }

  initForm(){
    this.chatForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  sendMessage() {
    const currUser = this.userService.currentUser;
    const controls = this.chatForm.controls;
    if (this.chatForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.webSocketService.send({
      userID: currUser.userID,
      nick: currUser.nick,
      text: this.chatForm.value['text']
    });
    this.chatForm.reset();
    this.scrollToBottom();
  }

  enterTextarea(e) {
    if (this.webSocketService.socket.disconnected){
      this.webSocketService.connectSocket();
    }
    if (e.keyCode === 13) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  public scrollToBottom(): void {
    this.mbox.nativeElement.scrollTop = this.mbox.nativeElement.scrollHeight;
  }

}
