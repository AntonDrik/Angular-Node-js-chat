import {Component} from '@angular/core';
import {FileUploadService} from '../../../services/file-upload.service';

type Fn = (file: File) => void;

@Component({
  selector: 'app-attach-preview',
  templateUrl: './attach-preview.component.html',
  styleUrls: ['./attach-preview.component.scss']
})
export class AttachPreviewComponent {

  constructor(private fileUploadService: FileUploadService) {
  }

  get src() {
    return this.fileUploadService.imageSrc;
  }

  handleClear() {
    this.fileUploadService.clear();
  }

}
