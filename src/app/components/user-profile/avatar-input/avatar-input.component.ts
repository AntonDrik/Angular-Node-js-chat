import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'avatar-upload',
  templateUrl: './avatar-input.component.html',
  styleUrls: ['./avatar-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AvatarInputComponent,
      multi: true
    }
  ]
})
export class AvatarInputComponent implements OnInit {

  @Input() imgURL;
  onChange: Function;
  private file: File | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    if (file) {
      this.onChange(file);
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }

  constructor(private host: ElementRef<HTMLInputElement>) { }

  ngOnInit() {}

  writeValue( value: null ) {
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange( fn: Function ) {
    this.onChange = fn;
  }

  registerOnTouched() {}

}
