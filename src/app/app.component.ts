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
  private login:boolean = false;
  private nick:string = "";
  chatForm: FormGroup;
  messages: Message[] = [];
  disableScrollDown = false;
  ioConnection: any;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private fb: FormBuilder,
              private http: HttpClient,
              private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      const activated: ActivatedRoute[] = this.activatedRoute.root.children;
      this.login = activated[0].snapshot.data['login'];
      this.nick = localStorage.getItem('userName');
    });
    this.initForm();
    this.authService.isLoggedIn().subscribe(status => {
      if(status) {
        this.initSocket();
        this.registerDomEvents();
        this.loadMessages();
      }
    });
  }

  initSocket(): void{
    this.webSocketService.initSocket();

    this.ioConnection = this.webSocketService.onMessage().subscribe((message:Message) => {
      this.messages.push(message);
    });

    this.webSocketService.onEvent('connect').subscribe(() =>{
      console.log('connected');
      this.webSocketService.send({
        nick: this.nick,
        text: 'BrusBoxed',
        action: 'connect'
      });
    });
  }

  loadMessages(){
    this.http.get('http://localhost:3000/api/messages').subscribe((data:[]) => {
      this.messages = data.reverse();
      this.mbox.nativeElement.scrollTop = this.mbox.nativeElement.scrollHeight;
    });
  }

  registerDomEvents(){
    window.addEventListener("beforeunload",  (event) => {
      this.authService.logout();
      this.webSocketService.send({
        nick: this.nick,
        text: 'DisBrusBoxed',
        action: 'disconnect'
      });
    });
  }

  initForm(){
    this.chatForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  sendMessage() {
    const controls = this.chatForm.controls;
    if (this.chatForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.webSocketService.send({
      nick: this.nick,
      text: this.chatForm.value['text'],
      date: new Date()
    });
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  public scrollToBottom(): void {
    try {
      this.mbox.nativeElement.scrollTop = this.mbox.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
