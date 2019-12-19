import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from "rxjs";
import {Message} from "../interfaces/message";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public socket: any;
  readonly SERVER_URL: string = 'http://localhost:3000';

  constructor() {}

  initSocket(){
    // this.socket = io(this.SERVER_URL, {path: '/chat',timeout: 100});
    this.socket = io();
  }

  onMessage(): Observable<Message>{
    return new Observable<Message>(subscriber => {
      this.socket.on('message', (data:Message) => subscriber.next(data));
    })
  }

  onEvent(event): Observable<any> {
    return new Observable<string>(subscriber => {
      this.socket.on(event, () => subscriber.next())
    })
  }

  send(message: Message): void {
    this.socket.emit('message', message);
  }
}
