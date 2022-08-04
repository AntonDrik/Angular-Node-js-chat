import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AttachFileService} from '../../../services/attach-file.service';

type Fn = (file: File) => void;

@Component({
  selector: 'app-attach-input',
  templateUrl: './attach-input.component.html',
  styleUrls: ['./attach-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AttachInputComponent,
      multi: true
    }
  ]
})
export class AttachInputComponent implements OnInit, ControlValueAccessor {

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
    private fileUploadService: AttachFileService
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
