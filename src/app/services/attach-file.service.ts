import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../interfaces/User';
import {Response} from '../interfaces/Response';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AttachFileService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  imageSrc: string;

  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  clear() {
    this.imageSrc = null;
    this.messageSource.next('clear');
  }

}
