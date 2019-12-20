import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {RegisterService} from "../services/register.service";
import {Error} from "../interfaces/error";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() isAdminPanel: boolean = false;

  loginForm: FormGroup;
  registerForm: FormGroup;
  isWrongCred:boolean = false;
  serverRes: Error;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private registerService: RegisterService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.pattern(/[A-z]/)
      ]],
      password: ['', [
        Validators.required
      ]]
    });

    this.registerForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.pattern(/[A-z0-9]/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    },
      {validator: this.matchPassword}
      );
  }

  matchPassword(formGroup: FormGroup){
    const password = formGroup.controls['password'].value;
    const confirmPassword = formGroup.controls['confirmPassword'].value;
    if (confirmPassword && confirmPassword.length) {
      return (password === confirmPassword) ? null : {'mismatch': true}
    }
  }

  resetForm(event) {
    if (event.index) {
      this.loginForm.reset();
    }
    else {
      this.registerForm.reset();
    }
    if(this.serverRes) {
      this.serverRes = undefined;
    }
  }

  onSubmit(form: FormGroup) {
    const controls = form.controls;
    if (form.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.isWrongCred = true;
      setTimeout(() => {this.isWrongCred = false;},2000);
      return;
    }
    const data = form.value;
    //login
    if (form === this.loginForm) {
      // this.authService.login(form.value['login']);
      // this.router.navigate(['/chat']);
    }
    //register
    else {
      this.registerService.register(data).subscribe((data: Error) => {
        this.serverRes = data;
      });
    }
  }

  get login(): any { return this.loginForm.get('login')};
  get password(): any { return this.loginForm.get('password')}

  get regLogin(): any { return this.registerForm.get('login')};
  get regPassword(): any { return this.registerForm.get('password')}
  get confPassword(): any { return this.registerForm.get('confirmPassword')}

}
