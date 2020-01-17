import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../interfaces/User";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Response} from "../../interfaces/Response";

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  isEditable: boolean = false;
  user: User;
  userProfileForm: FormGroup;
  serverRes: Response;

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private userService: UserService) {
    this.user = data.user;
    this.isEditable = data.isEditable;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userProfileForm = this.formBuilder.group({
      nick: [this.user.nick, Validators.maxLength(10)],
      status: this.user.status,
      avatar: [null, this.requiredFileType(['png', 'jpg', 'jpeg'])]
    });
  }
  requiredFileType( types: string[] ) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (!types.includes(extension.toLowerCase())) {
          return {
            requiredFileType: true
          };
        }
        return null;
      }
      return null;
    };
  }

  onSubmit(form: FormGroup) {
    const controls = form.controls;
    if (form.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.serverRes = {
        ok: false,
        caption: 'Только png, jpeg, jpg'
      };
      return;
    }
    // need FormData
    const formData = new FormData();
    if(form.value['nick'] !== this.userService.currentUser.nick) {
      formData.append('nick', form.value['nick']);
    }
    if(form.value['status'] !== this.userService.currentUser.status) {
      formData.append('status', form.value['status']);
    }
    if (form.value['avatar'] !== null) {
      formData.append('avatar', form.value['avatar']);
    }
      this.userService.updateUser(formData).then((response: Response) => {
        this.serverRes = response;
      }).catch((error: Response) => {
        this.serverRes = error;
      });

    // if ((form.value['nick'] !== this.userService.currentUser.nick) ||
    //     (form.value['status'] !== this.userService.currentUser.status)) {
    //   const data = {
    //     nick: form.value['nick'],
    //     status: form.value['status'],
    //     nickIsEdited: (form.value['nick'] !== this.userService.currentUser.nick)
    //   };
    //   this.userService.updateUser(data).then((response: Response) => {
    //     this.serverRes = response;
    //   }).catch((error: Response) => {
    //     this.serverRes = error;
    //   });
    // }
    // else {
    //   this.serverRes = {
    //     ok: false,
    //     caption: 'Измените данные'
    //   }
    // }
  }

  get nick(): any { return this.userProfileForm.get('nick')};

}
