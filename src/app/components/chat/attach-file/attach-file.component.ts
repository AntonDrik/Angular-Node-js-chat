import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FileUploadService} from '../../../services/file-upload.service';

type Fn = (file: File) => void;

@Component({
  selector: 'app-attach-file',
  templateUrl: './attach-file.component.html',
  styleUrls: ['./attach-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AttachFileComponent,
      multi: true
    }
  ]
})
export class AttachFileComponent implements OnInit, ControlValueAccessor {

  onChange: Fn;
  private file: File | null = null;

  @HostListener('change', ['$event.target.files'])
  emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit() {
    this.fileUploadService.currentMessage.subscribe((data) => {
      if (data === 'clear') {
        console.log('handle change');
        this.onChange(null);
        this.file = null;
      }
    });
  }

  writeValue(value: null) {
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: Fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  readURL(event) {
    this.fileUploadService.readURL(event);
  }

}
