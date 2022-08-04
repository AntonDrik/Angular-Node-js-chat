import {Component} from '@angular/core';
import {AttachFileService} from '../../../services/attach-file.service';

type Fn = (file: File) => void;

@Component({
  selector: 'app-attach-preview',
  templateUrl: './attach-preview.component.html',
  styleUrls: ['./attach-preview.component.scss']
})
export class AttachPreviewComponent {

  constructor(private fileUploadService: AttachFileService) {
  }

  get src() {
    return this.fileUploadService.imageSrc;
  }

  handleClear() {
    this.fileUploadService.clear();
  }

}
