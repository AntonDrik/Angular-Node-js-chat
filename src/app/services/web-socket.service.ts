import { Injectable }   from '@angular/core';
import * as io          from 'socket.io-client';
import {Observable}     from "rxjs";
import {Message}        from "../interfaces/Message";
import {environment}    from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  public socket: any;

  constructor() {}

  initSocket(userID, userName): void {
    console.log(`InitSocket: ${userID}, ${userName}`);
    this.socket = io({
      reconnection: false,
      query: `userName=${userName}`
    });
    // this.socket = io({
    //   reconnection: false,
    //   query: `userName=${userName}`
    // });
  }

  connectSocket(): void {
    this.socket.connect();
  }

  disconnectSocket(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  onMessage(): Observable<Message> {
    return new Observable<Message>(subscriber => {
      this.socket.on('message', (data:Message) => subscriber.next(data));
    })
  }

  onOnlineUsers():Observable<any> {
    return new Observable<any>(subscriber => {
      this.socket.on('updateUsers', data => subscriber.next(data));
    })
  }

  onConnect(): Observable<any> {
    return new Observable<any>(subscriber => {
      this.socket.on('connect', () => subscriber.next());
    })
  }

  onDisconnect(): Observable<any> {
    return new Observable<any>(subscriber => {
      this.socket.on('disconnect', (reason) => subscriber.next(reason));
    });
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
