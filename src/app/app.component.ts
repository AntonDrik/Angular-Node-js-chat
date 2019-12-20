import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {WebSocketService} from "./services/web-socket.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Message} from "./interfaces/message";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit{

  @ViewChild('mbox', {static: false}) private mbox: ElementRef;

  title = 'BrusChat';
  login:boolean = false;
  userName:string = "";
  chatForm: FormGroup;
  messages: Message[] = [];
  disableScrollDown = false;
  isTyping: boolean;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private fb: FormBuilder,
              private http: HttpClient,
              private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.initForm();
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      const activated: ActivatedRoute[] = this.activatedRoute.root.children;
      this.login = activated[0].snapshot.data['login'];
    });
    this.authService.isLoggedIn().subscribe(status => {
      alert(status);
      if(status) {
        this.userName = this.authService.getUser();
        this.initSocket(this.userName);
        this.registerDomEvents();
      }
    });
  }

  initSocket(userName){
    this.webSocketService.initSocket(userName);

    this.webSocketService.onConnect().subscribe( () => {
      this.loadMessages();
    });

    this.webSocketService.onMessage().subscribe((message:Message) => {
      this.messages.push(message);
    });

  }

  loadMessages(){
    // const uri = 'http://localhost:3001/api/messages';
    const uri = '/api/messages';
    this.http.get(uri).subscribe((data:[]) => {
      this.messages = data.reverse();
      this.scrollToBottom();
    });
  }

  registerDomEvents(){
    window.addEventListener("beforeunload",  (event) => {
      this.authService.logout();
    });
    window.addEventListener('focus',  () => {
      this.checkConnection();
    });
  }

  initForm(){
    this.chatForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  checkConnection(){
    if (this.webSocketService.socket.disconnected){
      this.webSocketService.socket.connect();
    }
  }

  sendMessage() {
    const controls = this.chatForm.controls;
    if (this.chatForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.webSocketService.send({
      nick: this.userName,
      text: this.chatForm.value['text'],
      date: new Date()
    });
    this.chatForm.reset();
    this.scrollToBottom();
  }

  enterTextarea(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  public scrollToBottom(): void {
    try {
      this.mbox.nativeElement.scrollTop = this.mbox.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
